# Generated by Django 4.2.4 on 2024-07-25 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sesiones_imt', '0007_marketing_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='programarsesiones',
            name='confirmacion',
            field=models.CharField(default='none', max_length=200),
        ),
    ]
