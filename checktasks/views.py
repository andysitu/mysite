from django.shortcuts import render, reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .models import DateRecord, Task

def view_tasks(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))

    tasks_list = get_tasks(request.user)

    return render(
        request,
        "checktasks/view.html",
        {
            "tasks": tasks_list,
        }
    )

def get_tasks(user):
    """
    Retrieves all of the tasks for a particular user.
    :param user: request.user
    :return: lists containing all of Tasks for that user
    """
    tasks_list = []
    tasks = Task.objects.filter(user=user)

    for task in tasks:
        tasks_list.append(task)

    return tasks_list

def add(request):
    user = request.user
    if request.method == "POST":
        name = request.POST.get("name")
        task = Task(name=name, user=user)
        task.save()

        return JsonResponse({"name": name})

    return JsonResponse({})

def ajax_tasks(request):
    """
        Retrieves all of the tasks for a particular user.
        :param user: request.user
        :return: lists containing all of Tasks for that user
    """

    tasks_list = []
    user = request.user
    tasks = Task.objects.filter(user=user)

    for task in tasks:
        tasks_list.append(task.name)

    return JsonResponse(tasks_list, safe=False)

def click_task_ajax(request):
    pass