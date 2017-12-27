from django.conf.urls import url

from . import views

app_name = 'budget_data'
urlpatterns = [
    url(r'^add/$', views.add_balance, name="add"),
]