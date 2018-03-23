from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .models import DateRecord, Task

def view_tasks(request):
    user = request.user
    tasks = Task.objects.filter(user=user)
    tasks_list = []

    for task in tasks:
        tasks_list.append(task)

    return render(
        request,
        "checktasks/view.html",
        {
            "tasks": tasks_list,
        }
    )

def add(request):
    user = request.user
    if request.method == "POST":
        name = request.POST.get("name")
        task = Task(name=name, user=user)
        task.save()

        return JsonResponse({"name": name})

    return JsonResponse({})