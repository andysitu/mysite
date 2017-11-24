from django.db import models
from django.contrib.auth.models import User
import datetime

class MonthlyBalance(models.Model):
    balance = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class DailyBalance(models.Model):
    date = models.DateField()
    balance = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class ExpenditureType(models.Model):
    type = models.CharField(max_length=50)
    description = models.CharField(max_length=200, default="")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class BaseExpenditure(models.Model):
    name = models.CharField(max_length=50, default='')
    amount_spent = models.FloatField(default=0.00)
    date = models.DateTimeField('date money was spent')

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ManyToManyField(ExpenditureType)

    def __str__(self):
        return str(self.amount_spent)

class Expenditure(BaseExpenditure):
    day = models.ForeignKey(DailyBalance)

class RecurringExpenditure(BaseExpenditure):
    days = models.ManyToManyField(DailyBalance)

class IncomeType(models.Model):
    type = models.CharField(max_length=50)
    description = models.CharField(max_length=200, default="")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class Income(models.Model):
    name = models.CharField(max_length=50, default='')
    amount = models.FloatField(default=0.00)
    date = models.DateTimeField('date money was earned')
    days = models.ManyToManyField(DailyBalance)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.income

class ProjectedIncome(Income):
    estimated_amount = models.FloatField()