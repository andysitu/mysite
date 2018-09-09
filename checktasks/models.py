from django.db import models

from django.contrib.auth.models import User
import datetime

class Task(models.Model):
    type = "bool"
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def edit_name(self, new_name):
        self.name = new_name
        self.save()

    def click(self, year, month, day):
        d = datetime.date(year, month, day)
        if self.daterecord_set.filter(date=d).exists():
            self.daterecord_set.filter(date=d).delete()
            return 0
        else:
            dR = DateRecord.objects.create(task=self,date=d)
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
        dates_q = self.daterecord_set.filter(date__gte=start_date,
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


class DateRecord(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField()

    def __str__(self):
        d = self.date
        return str(d.year) + "_" + str(d.month) + "_" + str(d.day)