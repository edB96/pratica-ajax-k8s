from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from .forms import RegistrationForm


# Create your views here.

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Create new user
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password1']
            user = User.objects.create_user(username, email, password)
            user.save()

            # Log in user
            user = authenticate(request, username=username, password=password)
            login(request, user)

            # Redirect to home page
            return redirect('main-page') # replace 'home' with the name of your home page URL

    else:
        form = RegistrationForm()

    return render(request, 'profiles/register.html', {'form': form})

def login_view(request):
    return render(request, 'profiles/login.html')

def logout_view(request):
    return render(request, 'profiles/logout.html')