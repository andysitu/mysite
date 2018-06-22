from django.urls import path, include

from . import views

app_name = "checktasks"
urlpatterns = [
    path('', views.view_tasks, name="main"),
    path('add', views.add, name="add"),

    path('get_ajax_tasks', views.ajax_tasks, name="ajax_tasks"),
    path('click_ajax', views.click_task_ajax, name="click_task_ajax"),
    path('del_task_ajax', views.del_task_ajax, name="del_task_ajax"),
    path('edit_task_ajax', views.edit_task_ajax, name="edit_task_ajax"),
]