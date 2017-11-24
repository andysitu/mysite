from django.contrib import admin

from .models import Expenditure, Income

# admin.site.register(Expenditure)
admin.site.register(Income)

@admin.register(Expenditure)
class ExpenditureAdmin(admin.ModelAdmin):

    fieldsets = (
        (None, {
            'fields': ('name', 'user',)
        }),
        ('Money', {
            'fields': ('amount_spent', 'date_spent',)
        }),
    )