const express = require("express");
const {
  getUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userController");
const { singup, verifyotp } = require("../controllers/authController");

const router = express.Router();

router.get("/users/", getUsers);
router.get("/users/:username", getUserByUsername);
router.post("/users/", createUser);
router.put("/users/:username", updateUser);
router.delete("/users/:username", deleteUser);
router.delete("/users/", deleteAllUsers);

router.post("/signup", singup);
router.post("/verifyotp", verifyotp);

module.exports = router;
