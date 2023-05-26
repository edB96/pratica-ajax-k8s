FROM python:3.11.3

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY . /code/
WORKDIR /code

RUN pip install --no-cache-dir -r requirements.txt

