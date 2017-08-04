from django.db import models
from django.contrib.auth.models import User

class Expenditure(models.Model):
    name = models.CharField(max_length=50, default='')
    amount_spent = models.FloatField(default=0.00)
    date_spent = models.DateTimeField('date money was spent')

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.amount_spent)

class Income(models.Model):
    name = models.CharField(max_length=50, default='')
    amount = models.FloatField(default=0.00)
    date = models.DateTimeField('date money was earned')

    def __str__(self):
        return self.income