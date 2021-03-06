const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
let server = null;

async function start(api, repository) {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use((err, req, res, next) => {
      reject(err);
      res.status(500).send("Something went wrong!");
    });

    api(app, repository);
    server = app.listen(parseInt(process.env.SERVER_PORT), () => resolve(app));
  });
}

async function stop() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close();
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

module.exports = { start, stop };
