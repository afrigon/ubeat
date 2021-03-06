![](https://raw.githubusercontent.com/afrigon/ubeat/master/static/img/banner.jpg)

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/f9503383fc3a1c0c83b9/maintainability)](https://codeclimate.com/github/afrigon/ubeat/maintainability)

Ubeat is a platform to share music with friends created for the course GLO-3201 at Laval University.

## Installation

You'll need to have [node and npm](https://nodejs.org/en/download/) installed. Start off by cloning the project to your machine.

```sh
git clone https://github.com/GLO3102-H18/ubeat-team-01.git ubeat
```

Install dependencies with npm.

```sh
cd ubeat
npm i
```

You can now run the server in production mode with the following command.

```sh
npm run-script start-prod
```

### Routes

The website will now be accessible according the configuration file ```config.json```. The following routes are available at ```localhost:9016``` with the default configuration.

#### Public routes

```
GET /login
GET /signup
GET /logout
```

#### Private routes

```
GET /
GET /album/:id
GET /artist/:id
GET /playlists
GET /playlist/:id
GET /user/:id
```

## License

Ubeat is [MIT licensed](./LICENSE).
