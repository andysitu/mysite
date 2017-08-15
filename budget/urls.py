from django.conf.urls import url

from . import views

app_name = 'budget'
urlpatterns = [
    url(r'^(?P<month>\d+)_(?P<date>\d+)_(?P<year>\d+)/$', views.index, name="index-placeholder"),
    url(r'^expenditures/$', views.ExpendituresByUserListView.as_view(), name='my-expenditures'),
    url(r'^$', views.index, name='index'),
    url(r'^view_day/$', views.view_day, name="view_day"),
]