# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-13 07:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='name',
            field=models.CharField(default='', max_length=50),
        ),
    ]
