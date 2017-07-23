from django.shortcuts import render
import datetime

# Create your views here.
from django.http import HttpResponse

def index(request):
    todays_date = datetime.date.today()

     # return HttpResponse("This is " + month + " " + date + " " + year)
    return render(
        request,
        'budget/index.html',
    )

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from .models import Expenditure

class ExpendituresByUserListView(LoginRequiredMixin, generic.ListView):
    """
    Generic class-based view listing expenditures held by current user
    """
    model = Expenditure
    template_name = 'budget/expenditure_list_user.html'
    paginate_by = 10

    def get_queryset(self):
        return Expenditure.objects.filter(user=self.request.user).order_by('amount_spent')