from django import forms
from .models import SongPost, TextPost

class TextPostForm(forms.ModelForm):
    # poichè uso crispy forms non c'è bisogno di scrivere i campi del form qui
    # title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    # body = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}))
    class Meta:
        model = TextPost
        fields = ('title', 'body',)

class AudioPostForm(forms.ModelForm):

    class Meta:
        model = SongPost
        fields = ('song_title', 'artist', 'year', 'audiofile',)
        
