from django.shortcuts import render, reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .models import DateRecord, Task

def view_tasks(request):
    tasks_list = []

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    user = request.user
    tasks = Task.objects.filter(user=user)

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