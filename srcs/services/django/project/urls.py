"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from django.http import JsonResponse
from . import views

urlpatterns = [
	path ('admin/', admin.site.urls),
	path ('', views.manage_request, name='home'),
	path ('get/', views.manage_request, name='home'),
	path ('post/', views.manage_request, name='home'),
	path ('api_42/', views.manage_42_api_step1, name='home'),
	path ('api_code/', views.manage_42_api_step2, name='home'),
	path ('register/', views.create_account, name='home'),
	path ('login/', views.log_in, name='home'),
	path ('logout/', views.logout, name='home'),
	path ('post/match/', views.match_end, name='home'),
	path ('post/tournament/', views.tournament_end, name='home'),
	path ('get/bestplayers/', views.get_best_players, name='home'),
	path ('get/globalstats/', views.get_global_stats, name='home'),
	path ('get/solostats/', views.get_solo_stats, name='home'),
	path ('get/duostats/', views.get_duo_stats, name='home'),
	path ('get/tournamentstats/', views.get_tournament_stats, name='home'),
	path ('get/victories/', views.get_victories, name='home'),
	path ('get/defeats/', views.get_defeats, name='home'),
	path ('get/victoriesbymode/', views.get_victories_mode, name='home'),
	path ('get/pointsbymatch/', views.get_points_by_match, name='home'),
	path ('get/matchstats/', views.get_match_stats, name='home'),
	path ('get/isuserconnected/', views.is_user_signed_in, name='home'),
	path ('get/avatar/', views.get_avatar, name='home'),
	path ('post/avatar/', views.post_avatar, name='home'),
	path ('get/friendrequests/', views.get_requests, name='home'),
	path ('post/declinefriendrequest/', views.post_decline_request, name='home'),
	path ('post/removefriend/', views.post_remove_friend, name='home'),
	path ('post/addfriend/', views.post_add_friend, name='home'),
	path ('get/friendslist/', views.get_friends_list, name='home'),
	path ('post/username/', views.post_username, name='home'),
	path ('post/password/', views.post_password, name='home'),
	path('get/setblock/', views.set_block, name='home'),
	path('get/getblock/', views.get_block, name='home'),
	path ('get/currentuser/', views.get_current_user, name='home'),
	path ('favicon.ico', views.get_favicon, name='favicon')
]

def protected_serve(request, path, document_root=None, show_indexes=False):
	if not request.session.get('user_id'):
		return JsonResponse({'error':'Unauthorized method'}, status=405)
	else:
		return serve(request, path, document_root, show_indexes)

if settings.DEBUG is False:
	urlpatterns += [
		re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
		re_path(r'^media/(?P<path>.*)$', protected_serve, {'document_root': settings.MEDIA_ROOT}),
	]
