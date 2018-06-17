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
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    completed_dates = models.ForeignKey(DateRecord, on_delete=models.CASCADE, blank=True, null=True)

    def click(self, year, month, day):
        d = DateRecord.get_DateRecord(year,month,day)
        if self.completed_dates.filter(pk=d.pk).exists():
            self.completed_dates.remove(d)
            return 0
        else:
            self.completed_dates.add(d)
            return 1

    def make_task_dic(self, start_date, end_date):
        """
        :param task_name: String of task Name
        :param user: Request.User
        :param start_date: datetime of first start
        :param end_date: datetime of end date
        :return: {
            "taskName": [string],
            "taskType": [string],
            "dates': { [yyyy]_[mm]_[dd]: value }
        }
        """
        task_type = self.type
        dates_dic = {}
        dates_q = DateRecord.objects.filter(task=self).filter(date__gte=start_date,
                                                              date__lte=end_date)
        for d in dates_q:
            date_string = str(d)
            if task_type == "bool":
                dates_dic[date_string] = 1

        task_dic = {
            "taskName": self.name,
            "taskType": task_type,
            "dates": dates_dic,
        }

        return task_dic