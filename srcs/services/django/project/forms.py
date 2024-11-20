from django import forms
from .models import Player

class AvatarForm(forms.ModelForm):

	class Meta:
		model = Player
		fields = ['avatar_img']
