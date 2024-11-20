from django.contrib import admin
from .models import Player, Tournament, Match

# Register your models here.
admin.site.register(Player)
admin.site.register(Tournament)
admin.site.register(Match)

