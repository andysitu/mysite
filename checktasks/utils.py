from checktasks.models import DateRecord, Task
import datetime

def get_DateRecord(year, month, day):
    date_q = DateRecord.objects.filter(date__year=year,
                                       date__month=month,
                                       date__day=day)
    if len(date_q) > 0:
        return date_q[0]
    else:
        d_date = datetime.day(year,month,day)
        d_daterecord = DateRecord(date=d)
        d_daterecord.save()