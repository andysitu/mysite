from django.conf.urls import url

from . import views

app_name = 'budget'
urlpatterns = [
    url(r'^(?P<month>\d+)_(?P<date>\d+)_(?P<year>\d+)/$', views.test, name="test"),
    url(r'^expenditures/$', views.ExpendituresByUserListView.as_view(), name='my-expenditures'),
    url(r'^$', views.index, name='index'),
]