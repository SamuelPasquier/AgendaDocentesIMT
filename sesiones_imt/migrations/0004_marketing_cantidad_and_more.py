# Generated by Django 4.2.4 on 2024-07-20 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sesiones_imt', '0003_alter_marketing_modalidad'),
    ]

    operations = [
        migrations.AddField(
            model_name='marketing',
            name='cantidad',
            field=models.CharField(default='none', max_length=200),
        ),
        migrations.AddField(
            model_name='marketing',
            name='comentariosdocentesesion',
            field=models.CharField(default='none', max_length=500),
        ),
        migrations.AddField(
            model_name='marketing',
            name='confirmacion',
            field=models.CharField(default='none', max_length=200),
        ),
        migrations.AlterField(
            model_name='marketing',
            name='detalleambiente',
            field=models.CharField(default='none', max_length=500),
        ),
        migrations.AlterField(
            model_name='marketing',
            name='detalletemaconsulta',
            field=models.CharField(default='none', max_length=400),
        ),
    ]
