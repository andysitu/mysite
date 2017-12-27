from django.shortcuts import render, redirect
import datetime

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from .models import Expenditure

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

def add_balance(request):
    if request.method == "POST":
        type = request.POST.get("add-type")
        amount = request.POST.get("amount")
        date = request.POST.get("date")

        return JsonResponse({
            "type": type,
            "date": date,
            "amount": amount,
        })
