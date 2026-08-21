import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Trips, Status

class TripTrackingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if not self.user.is_authenticated:
            await self.close()
            return
            
        self.trip_id = self.scope['url_route']['kwargs']['trip_id']
        self.group_name = f"trip_{self.trip_id}"
        
        # Verify trip and user permissions
        has_permission, self.role = await self.verify_trip_access()
        
        if not has_permission:
            await self.close()
            return
            
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive_json(self, content):
        # Process location updates from driver or passenger
        msg_type = content.get('type')
        if msg_type == 'location':
            lat = content.get('lat')
            lng = content.get('lng')

            if lat is None or lng is None:
                return

            # Update DB based on role
            if self.role == 'driver':
                await self.update_driver_location(lat, lng)
                event_type = 'trip_location_update'
            elif self.role == 'passenger':
                await self.update_passenger_location(lat, lng)
                event_type = 'trip_location_update'  # reuse same handler on clients; include role below
            else:
                return

            # Broadcast location to group (include role so clients can distinguish)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': event_type,
                    'role': self.role,
                    'lat': lat,
                    'lng': lng,
                    'heading': content.get('heading'),
                    'timestamp': content.get('timestamp')
                }
            )

    async def trip_location_update(self, event):
        # Send message to WebSocket
        payload = {
            'type': 'location',
            'lat': event['lat'],
            'lng': event['lng'],
            'heading': event.get('heading'),
            'timestamp': event.get('timestamp')
        }

        # Include role when present so consumers can tell driver vs passenger updates
        if 'role' in event:
            payload['role'] = event['role']

        await self.send_json(payload)

    @database_sync_to_async
    def verify_trip_access(self):
        try:
            trip = Trips.objects.get(id=self.trip_id)
            
            if trip.status not in [Status.ACCEPTED, Status.STARTED]:
                return False, None
                
            if trip.driver and trip.driver.user == self.user:
                return True, 'driver'
                
            if trip.rider and trip.rider.user == self.user:
                return True, 'passenger'
                
            return False, None
        except Trips.DoesNotExist:
            return False, None

    @database_sync_to_async
    def update_driver_location(self, lat, lng):
        try:
            trip = Trips.objects.get(id=self.trip_id)
            trip.driver_lat = lat
            trip.driver_lng = lng
            trip.save(update_fields=['driver_lat', 'driver_lng'])
            
            if trip.driver:
                profile = trip.driver
                profile.last_lat = lat
                profile.last_lng = lng
                profile.last_active_at = timezone.now()
                profile.save(update_fields=['last_lat', 'last_lng', 'last_active_at'])
        except Trips.DoesNotExist:
            pass

    @database_sync_to_async
    def update_passenger_location(self, lat, lng):
        try:
            trip = Trips.objects.get(id=self.trip_id)
            # Store live passenger device coordinates on the trip
            trip.passenger_lat = lat
            trip.passenger_lng = lng
            trip.save(update_fields=['passenger_lat', 'passenger_lng'])
        except Trips.DoesNotExist:
            pass
