"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.contrib import admin
from django.shortcuts import redirect

from django.views.i18n import JavaScriptCatalog


from . import views

app_name = "mysite"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('checktasks/', include('checktasks.urls')),
    path('budget/', include('budget.urls')),
    path('budget_data/', include('budget_data.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', views.index, name="index"),
    path('index/', views.index,),

    path('warehouse_data/', include('warehouse_data.urls')),
    path('warehouse_viewer/', include('warehouse_viewer.urls')),
    path('warehouse_map/', include('warehouse_map.urls')),
    path('rcv_list/', include('rcv_list.urls')),

    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    path('i18n/', include('django.conf.urls.i18n')),

]

urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]