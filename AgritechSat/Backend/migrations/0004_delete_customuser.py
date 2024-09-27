

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0003_alter_sensordata_timestamp'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]
