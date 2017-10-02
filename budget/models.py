from django.db import models
from django.contrib.auth.models import User
import datetime


class Day(models.Model):
    date = models.DateField()


class BalanceAccount(models.Model):
    name = models.CharField(max_length=25)
    date = models.DateField(default=datetime.date.today)
    amount = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)


class ExpenditureType(models.Model):
    type = models.CharField(max_length=50)
    description = models.CharField(max_length=200, default="")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)


class Expenditure(models.Model):
    name = models.CharField(max_length=50, default='')
    amount_spent = models.FloatField(default=0.00)
    date = models.DateTimeField('date money was spent')
    days = models.ManyToManyField(Day)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ManyToManyField(ExpenditureType)

    def __str__(self):
        return str(self.amount_spent)


class RecurringExpenditure(Expenditure):
    frequency_day = models.IntegerField()


class Income(models.Model):
    name = models.CharField(max_length=50, default='')
    amount = models.FloatField(default=0.00)
    date = models.DateTimeField('date money was earned')
    days = models.ManyToManyField(Day)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.income


class IncomeType(models.Model):
    type = models.CharField(max_length=50)
    description = models.CharField(max_length=200, default="")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)


class ProjectedIncome(Income):
    estimated_amount = models.FloatField()