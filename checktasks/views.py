from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

def view_tasks(request):
    return HttpResponse("HELLO")