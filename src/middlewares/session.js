const session = require("express-session");

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true in production with HTTPS
});

module.exports = sessionMiddleware;
