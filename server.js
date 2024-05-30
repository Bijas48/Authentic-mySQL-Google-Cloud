require("dotenv").config();
const express = require("express");
const sessionMiddleware = require("./src/middlewares/session");
const routesthisapp = require("./src/routes/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(sessionMiddleware);

// app.get("/", (req, res) => {
//   res.send("Homepage");
// });

app.use("/", routesthisapp);

// Handle 404
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.listen(port, () => {
  console.log(`FinancyQ listening on "http://localhost:${port}"`);
});
