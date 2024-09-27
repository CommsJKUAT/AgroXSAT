
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0002_sensordata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sensordata',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
