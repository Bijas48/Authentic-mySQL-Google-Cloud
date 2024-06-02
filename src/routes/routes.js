const express = require("express");
const {
  signup,
  verifyOtp,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const {
  getUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.get("/users/", authenticateToken, getUsers);
router.get("/users/:username", authenticateToken, getUserByUsername);
router.post("/users/", authenticateToken, createUser);
router.put("/users/:username", authenticateToken, updateUser);
router.delete("/users/:username", authenticateToken, deleteUser);
router.delete("/users/", authenticateToken, deleteAllUsers);

router.post("/signup", signup);
router.post("/verifyotp", verifyOtp);
router.post("/login", login);
router.post("/token", refreshToken);
router.post("/logout", logout);

module.exports = router;
