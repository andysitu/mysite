from django.shortcuts import render, redirect
import datetime

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from budget_data.models import Expenditure

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

def view_day(request, year=None, month=None, day=None):
    if year == None and month == None and day == None:
        d = datetime.date.today()

    else:
        d = datetime.date(int(year), int(month), int(day))
    d_year = d.year
    d_month = d.month
    d_monthstr = d.strftime("%B")
    d_day = d.day
    return render(
        request,
        'budget/view_day.html',
        context = {
            "year": d_year,
            "month": d_month,
            'month_str': d_monthstr,
            "day": d_day,
        }
    )

def view_prev_day(request, year, month, day):
    d = datetime.date(int(year), int(month), int(day))
    new_day = d + datetime.timedelta(days=-1)
    return redirect("budget:view_day", year=new_day.year, month=new_day.month, day=new_day.day)


def view_next_day(request, year, month, day):
    d = datetime.date(int(year), int(month), int(day))
    new_day = d + datetime.timedelta(days=1)
    return redirect("budget:view_day", year=new_day.year, month=new_day.month, day=new_day.day)

def index(request):
    todays_date = datetime.date.today()

     # return HttpResponse("This is " + month + " " + date + " " + year)
    return render(
        request,
        'budget/index.html',
    )

def add_page(request):
    return render(
        request,
        "budget/add.html",
        context={},
    )

def add(request):
    if request.method == "POST":
        type = request.POST.get("add-type")
        amount = request.POST.get("amount")
        time_amount = request.POST.get("time-amount")
        date = request.POST.get("date")
        time_amount_type = request.POST.get("time-amount-type")

        return JsonResponse({
            "type": type,
            "date": date,
            "time_amount": time_amount,
            "amount": amount,
            "time_amount_type": time_amount_type,
        })

class ExpendituresByUserListView(LoginRequiredMixin, generic.ListView):
    """
    Generic class-based view listing expenditures held by current user
    """
    model = Expenditure
    template_name = 'budget/expenditure_list_user.html'
    paginate_by = 10

    def get_queryset(self):
        return Expenditure.objects.filter(user=self.request.user).order_by('amount_spent')