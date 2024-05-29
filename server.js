const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");
app.use(express.json());
const prisma = new PrismaClient();

let users = [];

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

//Fitur CRUD mysql Testing
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
            },
          },
          {
            email: {
              equals: email,
            },
          },
        ],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const result = await prisma.user.create({
      data: { username, email, password },
    });
    res.status(200).json({ message: "User created in database" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user: " + error.message });
  }
});

// ganti username dan password by email
app.put("/users", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { username, password },
    });
    res.status(200).json({ message: "user updated in database" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user: " + error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users: " + error.message });
  }
});

// app.delete("/users", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await prisma.user
//       .delete({
//         where: { email: email },
//       })
//       .send("Berhasil");
//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//     } else {
//       res.status(200).json({ message: "User deleted from database" });
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ error: "Error deleting user: " + error.message });
//   }
// });

app.delete("/users", async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await prisma.user.delete({
      where: {
        OR: [{ username }, { email }],
      },
    });
    res.status(200).json({ message: "user deleted from database" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user: " + error.message });
  }
});

app.delete("/users/all", async (req, res) => {
  try {
    await prisma.user.deleteMany(); // Delete all users
    res.status(200).json({ message: "All users deleted from database" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting all users: " + error.message });
  }
});

// Batas

app.get("/login", (req, res) => {
  res.send("this is login");
});

app.get("/register", (req, res) => {
  res.send("Welcome to Register");
});

app.listen(port, () => {
  console.log(`FinancyQ listening on "http://localhost:${port}"`);
});
