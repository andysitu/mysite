from django.conf.urls import url

from . import views

app_name = 'budget'
urlpatterns = [
    url(r'^(?P<month>\d+)_(?P<date>\d+)_(?P<year>\d+)/$', views.index, name="index-placeholder"),
    url(r'^expenditures/$', views.ExpendituresByUserListView.as_view(), name='my-expenditures'),
    url(r'^$', views.view_day, name='index'),
    url(r'^view_day/$', views.view_day, name='view_day-blank'),
    url(r'^view_day/(?P<year>\d{0,4})/(?P<month>\d{0,2})/(?P<day>\d{0,2})/$', views.view_day, name="view_day"),
    url(r'^view_prev_day/(?P<year>\d{0,4})/(?P<month>\d{0,2})/(?P<day>\d{0,2})/$', views.view_prev_day, name="view_prev_day"),
    url(r'^view_next_day/(?P<year>\d{0,4})/(?P<month>\d{0,2})/(?P<day>\d{0,2})/$', views.view_next_day, name="view_next_day"),

    url(r'^add/$', views.add, name="add"),
    url(r'^add_page/$', views.add_page, name="add_page"),
]