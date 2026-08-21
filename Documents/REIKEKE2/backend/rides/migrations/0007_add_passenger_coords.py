# Generated migration to add passenger_lat and passenger_lng to Trips
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('rides', '0006_trips_driver_lat_trips_driver_lng'),
    ]

    operations = [
        migrations.AddField(
            model_name='trips',
            name='passenger_lat',
            field=models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='trips',
            name='passenger_lng',
            field=models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True),
        ),
    ]
