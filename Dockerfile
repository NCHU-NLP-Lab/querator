FROM node:12.22.6-alpine3.13 AS nodejs
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN cd react&&npm install&&npm run build

FROM tensorflow/tensorflow:2.3.0
RUN mkdir /app
WORKDIR /app
COPY --from=nodejs /app /app

#
RUN apt-get update && apt-get install -y git && apt-get install -y vim
RUN apt-get install -y wget
RUN apt-get install -y curl
RUN apt-get install -y rsyslog

# install gdown
RUN pip uninstall -y  enum34
RUN pip install gdown

# env setup
RUN pip install -r requirements.txt

EXPOSE 8000
ENTRYPOINT uvicorn server:app --host 0.0.0.0

