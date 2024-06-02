const session = require("express-session");
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.SECRET_SESSION_TOKEN,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true in production with HTTPS
});

module.exports = sessionMiddleware;
