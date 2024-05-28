const express = require("express");
const app = express();
const port = 3000;
let users = [];

app.use(express.json());

app.get("/", (req, res) => {
  res.send(users);
});

app.post("/", (req, res) => {
  const data = req.body;
  users = [...users, data];
  res.send("user created");
});

app.delete("/:name?", (req, res) => {
  const params = req.params.name;
  let deleteuser = users.filter((val) => val.name !== params);
  users = deleteuser;
  res.send(users);
});

app.put("/", (req, res) => {
  const data = req.body;
  users.map((val) => {
    if (val.email === data.email) {
      val.name = data.name;
    }
  });
  res.send(users);
});

app.get("/login", (req, res) => {
  res.send("this is login");
});

app.get("/register", (req, res) => {
  res.send("Welcome to Register");
});

app.listen(port, () => {
  console.log(`FinancyQ listening on "http://localhost:${port}"`);
});
