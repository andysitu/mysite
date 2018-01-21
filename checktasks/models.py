from django.db import models

from django.contrib.auth.models import User
import datetime

class DateRecord(models.Model):
    date = models.DateField()

class Tasks(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    completed_dates = models.ManyToManyField(DateRecord)