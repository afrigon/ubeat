![](http://res.cloudinary.com/frigstudio/image/upload/v1514115143/image-resize-banner_guzwlg.jpg)

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![Dependency Status](https://david-dm.org/afrigon/ubeat/status.svg)](https://david-dm.org/afrigon/ubeat)

This command line interface enables you to resize squared images to desired size super quickly.

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

The website will now be accessible according the configuration file ```config.json```. The following routes are available with the default configuration.

```
localhost:8080
localhost:8080/album
localhost:8080/artist
```

### License

Ubeat is [MIT licensed](./LICENSE).