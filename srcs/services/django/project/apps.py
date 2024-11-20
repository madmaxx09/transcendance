from django.apps import AppConfig
from django.db import connection

class AppConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'project'
	def ready(self):
		from .models import Player
		if 'project_player' in connection.introspection.table_names():
			# Update all users to be logged out
			Player.objects.update(logged_in=False)
		if 'django_session' in connection.introspection.table_names():
			from django.contrib.sessions.models import Session
			# Delete all sessions to empty request.session
			Session.objects.all().delete()
