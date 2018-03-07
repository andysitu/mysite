from django.db import models

from django.contrib.auth.models import User
import datetime

class DateRecord(models.Model):
    date = models.DateField()

class Task(models.Model):
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    completed_dates = models.ManyToManyField(DateRecord, blank=True)