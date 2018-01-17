![](https://raw.githubusercontent.com/afrigon/ubeat/master/static/img/banner.jpg)

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![Dependency Status](https://david-dm.org/afrigon/ubeat/status.svg)](https://david-dm.org/afrigon/ubeat)

Ubeat is a platform to share music with friends created for the course GLO-3201 at University Laval.

## Installation

You'll need to have [node and npm](https://nodejs.org/en/download/) installed. Start off by cloning the project to your machine.

```sh
git clone https://github.com/afrigon/ubeat.git
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

The website will now be accessible according the configuration file ```config.json```. The following routes are available at ```localhost:9016``` with the default configuration.

```
GET / HTTP/1.1
GET /album HTTP/1.1
GET /artist HTTP/1.1
```

### License

Ubeat is [MIT licensed](./LICENSE).