FROM tensorflow/tensorflow:2.3.0
RUN mkdir /app
WORKDIR /app
COPY . /app

#
RUN apt-get update && apt-get install -y git && apt-get install -y vim
RUN apt-get install -y wget
RUN apt-get install -y curl
RUN apt-get install -y rsyslog

# install gdown
RUN pip uninstall -y  enum34
RUN pip install gdown

# nodejs 12.x
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs

# env setup
RUN cd react&&npm install&&npm run build
RUN pip install -r requirements.txt

EXPOSE 8000
ENTRYPOINT ["uvicorn", "server:app", "--host", "0.0.0.0"]
