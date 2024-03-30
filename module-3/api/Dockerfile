FROM python:alpine3.19
EXPOSE 80
WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app/
ENV MONGO_URL "mongodb://admin:admin@mongo:27017/"
ENV API_ROOT_PATH "/"
CMD [ "python","app/main.py"]
