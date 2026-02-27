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

def BlastSearch(trip_id):
    # Get all online drivers, minus those who already rejected this specific trip
    # We ignore location proximity for now since the pool is small in Yola
    drivers = DriverProfile.objects.filter(
        is_online=True
        # Optional: Add .filter(is_busy=False) if you have that field
    )

    if trip_id:
        drivers = drivers.exclude(rejected_trips__id=trip_id)

    # Return the QuerySet directly (or .all() if you need to force evaluation)
    return drivers








