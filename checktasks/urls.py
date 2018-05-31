from django.urls import path, include

from . import views

app_name = "checktasks"
urlpatterns = [
    path('', views.view_tasks, name="main"),
    path('add', views.add, name="add"),

    path('get_ajax_tasks', views.ajax_tasks, name="ajax_tasks"),
    path('click_ajax', views.click_task, name="click_task_ajax"),
]