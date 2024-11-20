from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager
import datetime
import uuid

# Player class, once set is added to the DB

class Player(models.Model):
	username = models.CharField(max_length=15, unique=True, blank=False)
	password = models.CharField(max_length=200)
	tournaments = models.ManyToManyField('Tournament', related_name='players', blank=True)
	matches_won = models.IntegerField(default=0)
	logged_in = models.BooleanField(default=False)
	linked_42_acc = models.CharField(max_length=30, unique=True, blank=True, null=True)
	is_42_acc = models.BooleanField(default=False)
	friends = models.ManyToManyField('Player', symmetrical=False, blank=True, related_name='friended_by')
	matches = models.ManyToManyField('Match', related_name='players', blank=True)
	friends_request = models.ManyToManyField('Player', symmetrical=False, blank=True, related_name='request_by')
	avatar_img = models.ImageField(upload_to='images/', blank=True, null=True)

	def set_password(self, raw_password):
		self.password = make_password(raw_password)
		self.save()

	def __str__(self):
		return self.username
		
class Tournament(models.Model):
	winner = models.CharField(max_length=255, blank=False)
	matchs = models.ManyToManyField('Match', related_name='tournament', blank=True)

	def __str__(self):
		return self.winner

class Match(models.Model):
	player1 = models.CharField(max_length=255, blank=False)
	player2 = models.CharField(max_length=255, default='Anonymous')
	mode = models.CharField(max_length=255, blank=False)
	winner = models.CharField(max_length=255, blank=False)
	player1_points = models.IntegerField()
	player2_points = models.IntegerField()
	date = models.DateTimeField()
	match_time = models.DecimalField(max_digits=10, decimal_places=3)
