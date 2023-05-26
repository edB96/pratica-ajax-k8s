# pratica-ajax

INSTALLATION:

WINDOWS:
- download Docker Desktop
- abilita k8s from Docker Desktop
- nella directory "kubernetes" esegui:
	- kubectl apply -f db-deployment-service.yaml
	- attendi che il pod runna (kubectl get pods fin quando "ready 1/1")
	- kubectl apply -f web-deployment-service.yaml
- con browser accedi all'URL "localhost:8000"

PER CREARE SUPERUSER E CARICARE POST:
- docker ps -> copia ID del container relativo all'immagine "edb96/pratica_ajax"
- esegui "docker exec -it <IDcontainer> bash"
- esegui "python manage.py createsuperuser" e segui prompt per creare superuser
- all'url localhost:8000/admin logga con le credenziali del superuser
- torna a localhost:8000 e prova a caricare un text post e un audio post
