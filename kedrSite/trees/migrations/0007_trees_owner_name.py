# Generated by Django 4.2.20 on 2025-05-17 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trees', '0006_trees_dedicated_to'),
    ]

    operations = [
        migrations.AddField(
            model_name='trees',
            name='owner_name',
            field=models.CharField(default='', max_length=256),
        ),
    ]
