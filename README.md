# Querator

Question Generation Demo Platform backed by [NCHU NLP API](https://github.com/NCHU-NLP-Lab/api).

## Overview

There are currently 3 modes, clicking the `?` in navigation bar on the page to get detail animation

| Mode              | Link                                           | Description                                                   |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| Querator AI       | [Link](https://app2.queratorai.com/)           | Best for generate entity based question                       |
| Querator Group AI | [Link](https://app2.queratorai.com/group-mode) | Best for generate question set the are correlated             |
| Distractor AI     | Link                                           | Best for generate wrong options for multiple choices question |

## Deployment

Use this `docker-compose.yml` template with `docker-compose up --detach` command

```yaml
version: "3.8"

services:
  querator:
    image: "nchunlplab/querator:latest"
    container_name: "querator"
    restart: always
    ports:
      - "PORT_OF_YOUR_CHOICE:80"
```

## Development

### Setup

Run this on first time, make sure to use node v16

- Clone Repository

```shell
git clone https://github.com/NCHU-NLP-Lab/querator.git
cd querator
```

- Install Dependencies

```shell
npm install
```

### Launch

```shell
npm start
```

Default API backend is https://api.nlpnchu.org, change it with this command

```shell
REACT_APP_API=http://your.own.api.endpoint npm start
```

## Author

This project is supervised by Prof. [Yao-Chung Fan](http://web.nchu.edu.tw/~yfan/), with the following contributor:

🤖 = Model Training, 🧑🏻‍🎨 = React Frontend Development

- 🤖🧑🏻‍🎨Philip Huang ([@p208p2002](https://github.com/p208p2002))
- 🤖Harry Chan ([@Harry-Chan](https://github.com/Harry-Chan))
- 🤖Eric Lam ([@voidful](https://github.com/voidful))
- 🧑🏻‍🎨Tomy Hsieh ([@tomy0000000](https://github.com/tomy0000000))
