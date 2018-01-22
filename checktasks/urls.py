from django.urls import path, include

from . import views

app_name = "checktasks"
urlpatterns = [
    path('', views.view_tasks, name="main"),
    path('add', views.add, name="add"),
]