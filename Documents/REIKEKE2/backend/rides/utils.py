import math
from decimal import Decimal
from accounts.models import DriverProfile


def calculate_haversine_distance(lat1, lon1, lat2, lon2):
  
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])

    R = 6371.0 

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    

    a = min(1.0, max(0.0, a))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    return Decimal(str(distance)).quantize(Decimal('0.01'))

def fare_estimator(config,distance_km):
    raw_fare=config.base_fare +(Decimal(distance_km)*config.distance_price)


    final_fare=max(raw_fare,config.min_fare)

    return final_fare.quantize(Decimal('0.01'))

def RippleSearch(rider_lat,rider_lng,trip_id):
    search_radii=[2,5,10]

    for radii in search_radii:
        offset=Decimal(radii)*Decimal('0.009')
        min_lat= rider_lat-offset
        max_lat=rider_lat+offset
        min_lng=rider_lng-offset
        max_lng=rider_lng+offset

        drivers= DriverProfile.objects.filter(
            is_online=True,
            current_lng__range=(min_lng, max_lng),
            current_lat__range=(min_lat, max_lat)
        ).only('user','id')

        if trip_id:

            drivers = drivers.exclude(rejected_trips__id=trip_id)

  
        if drivers.exists():
            return drivers,radii
    return None,None















