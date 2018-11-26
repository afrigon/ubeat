FROM node:10-alpine

RUN apt update
RUN apt install python

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "start-prod"]

