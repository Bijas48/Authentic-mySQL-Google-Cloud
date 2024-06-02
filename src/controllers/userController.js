const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users: " + error.message });
  }
};

exports.getUserByUsername = async (req, res) => {
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
};

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: { equals: username } }, { email: { equals: email } }],
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
};

exports.updateUser = async (req, res) => {
  const username = req.params.username;
  const { username: newUsername, password } = req.body;

  try {
    const updateData = {};

    if (newUsername && newUsername !== username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: newUsername },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      updateData.username = newUsername;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const user = await prisma.user.update({
      where: { username },
      data: updateData,
    });

    res.status(200).json({ message: "User updated in database" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Error updating user: " + error.message });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await prisma.user.delete({
      where: {
        username: username,
      },
    });
    res.status(200).json({ message: "User deleted from database" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user: " + error.message });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await prisma.user.deleteMany(); // Delete all users
    res.status(200).json({ message: "All users deleted from database" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting all users: " + error.message });
  }
};
