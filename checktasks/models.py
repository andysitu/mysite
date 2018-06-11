from django.db import models

from django.contrib.auth.models import User
import datetime

class DateRecord(models.Model):
    date = models.DateField()

    def __str__(self):
        d = self.date
        return str(d.year) + "_" + str(d.month) + "_" + str(d.day)

    @classmethod
    def get_DateRecord(cls, year, month, day):
        date_q = cls.objects.filter(date__year=year,
                                           date__month=month,
                                           date__day=day)
        if len(date_q) > 0:
            return date_q[0]
        else:
            d_date = datetime.date(year, month, day)
            d_daterecord = cls(date=d_date)
            d_daterecord.save()
            return d_daterecord

class Task(models.Model):
    type = "bool"
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    completed_dates = models.ManyToManyField(DateRecord, blank=True)

    def click(self, year, month, day):
        d = DateRecord.get_DateRecord(year,month,day)
        # completed_date_q =
        return d.date