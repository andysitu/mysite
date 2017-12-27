from django.urls import path

from . import views

from budget_data import views as budget_data_views

app_name = 'budget'
urlpatterns = [
    path('<int:month>_<int:date>_<int:year>/', views.index, name="index-placeholder"),
    path('expenditures/', views.ExpendituresByUserListView.as_view(), name='my-expenditures'),
    path('', views.view_balance, name='index'),
    path('view_day/', views.view_day, name='view_day-blank'),
    path('view_day/<int:year>/<int:month>/<int:day>/', views.view_day, name="view_day"),
    path('view_prev_day/<int:year>/<int:month>/<int:day>/', views.view_prev_day, name="view_prev_day"),
    path('view_next_day/<int:year>/<int:month>/<int:day>/', views.view_next_day, name="view_next_day"),

    path('add_balance/', budget_data_views.add_balance, name="add_balance"),
    path('add_page/', views.add_page, name="add_page"),
]