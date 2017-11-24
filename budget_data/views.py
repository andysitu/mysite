from django.shortcuts import render, redirect
import datetime

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from .models import Expenditure

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

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
