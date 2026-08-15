import os
import requests
import logging

logger = logging.getLogger(__name__)

def get_route_info(origin_lat, origin_lng, dest_lat, dest_lng):
    """
    Calls Google Directions API to get route information between two points.
    Returns:
    {
        'polyline': str,
        'distance_km': float,
        'distance_text': str,
        'duration_minutes': float,
        'duration_text': str
    }
    """
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        logger.error("GOOGLE_MAPS_API_KEY environment variable not set")
        return None
        
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        'origin': f"{origin_lat},{origin_lng}",
        'destination': f"{dest_lat},{dest_lng}",
        'key': api_key,
        'departure_time': 'now',
        'traffic_model': 'best_guess'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get('status') == 'OK' and data.get('routes'):
            route = data['routes'][0]
            leg = route['legs'][0]
            
            # Use duration_in_traffic if available, else standard duration
            duration_obj = leg.get('duration_in_traffic', leg.get('duration'))
            
            return {
                'polyline': route['overview_polyline']['points'],
                'distance_km': leg['distance']['value'] / 1000.0,
                'distance_text': leg['distance']['text'],
                'duration_minutes': duration_obj['value'] / 60.0,
                'duration_text': duration_obj['text']
            }
        else:
            logger.error(f"Google Directions API returned status: {data.get('status')}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Google Directions API: {e}")
        return None
