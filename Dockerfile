FROM node:10-alpine
ENV NPM_CONFIG_LOGLEVEL info

RUN apk update
RUN apk add python
RUN apk add make
RUN apk add g++

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "start-prod"]

