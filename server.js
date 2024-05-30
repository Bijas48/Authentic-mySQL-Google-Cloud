const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");
const sessionMiddleware = require("./src/middlewares/session");
const { singup, verifyotp } = require("./src/controllers/authRoutes");

app.use(express.json());
app.use(sessionMiddleware);
const prisma = new PrismaClient();

// //Testing local
// let users = [];

// app.get("/", (req, res) => {
//   res.send(users);
// });

// app.post("/", (req, res) => {
//   const data = req.body;
//   users = [...users, data];
//   res.send("user created");
// });

// app.delete("/:name?", (req, res) => {
//   const params = req.params.name;
//   let deleteuser = users.filter((val) => val.name !== params);
//   users = deleteuser;
//   res.send(users);
// });

// app.put("/", (req, res) => {
//   const data = req.body;
//   users.map((val) => {
//     if (val.email === data.email) {
//       val.name = data.name;
//     }
//   });
//   res.send(users);
// });

//Fitur CRUD mysql Testing
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users: " + error.message });
  }
});

app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user: " + error.message });
  }
});

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
// app.put("/users", async (req, res) => {
//   const { email, username, password } = req.body;
//   try {
//     const user = await prisma.user.update({
//       where: { email },
//       data: { username, password },
//     });
//     res.status(200).json({ message: "user updated in database" });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating user: " + error.message });
//   }
// });

// ganti username dan password by email Versi Bagusnya
app.put("/users/:username", async (req, res) => {
  const username = req.params.username;
  const { username: newUsername, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { username: newUsername, password },
    });
    res.status(200).json({ message: "User updated in database" });
  } catch (error) {
    if (error.code === "P2025") {
      // P2025 is the error code for record not found in Prisma
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Error updating user: " + error.message });
    }
  }
});

app.delete("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await prisma.user.delete({
      where: {
        username: username,
      },
    });
    res.status(200).json({ message: "user deleted from database" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user: " + error.message });
  }
});

app.delete("/users/", async (req, res) => {
  try {
    await prisma.user.deleteMany(); // Delete all users
    res.status(200).json({ message: "All users deleted from database" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting all users: " + error.message });
  }
});

// Halaman Page

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.post("/login", (req, res) => {
  res.send("this is login");
});

app.post("/signup", singup);
app.post("/verifyotp", verifyotp);

// batas
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

// Batas BBGT Nyoba Kirim NodeMailer

app.listen(port, () => {
  console.log(`FinancyQ listening on "http://localhost:${port}"`);
});
