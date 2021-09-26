FROM node:12.22.6-alpine3.13 AS nodejs
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN cd react&&npm install&&npm run build

FROM tensorflow/tensorflow:2.3.1-gpu
RUN mkdir /app
WORKDIR /app
COPY --from=nodejs /app /app

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    git \
    rsyslog \
    vim \
    wget \
    && rm -rf /var/lib/apt/lists

# install gdown
RUN pip uninstall -y enum34
RUN pip install gdown

# env setup
RUN pip install -r requirements.txt

EXPOSE 8000
ENTRYPOINT uvicorn server:app --host 0.0.0.0

