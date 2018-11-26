FROM node:10-alpine

RUN apk update
RUN apk add python
RUN apk add make

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "start-prod"]

