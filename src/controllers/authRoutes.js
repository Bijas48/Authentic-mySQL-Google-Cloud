const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const generateOTP = require("../utils/otp");
const { sendingmail } = require("../utils/mailSender");

app.use(express.json());

const prisma = new PrismaClient();

exports.singup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validasi input
    if (!username || !email || !password) {
      return res.status(403).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Cek apakah pengguna sudah ada
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
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const otp = generateOTP();

    await prisma.oTP.create({
      data: { email, otp },
    });

    await sendingmail(email, otp);

    req.session.tempUserData = { username, email, password };

    res.status(200).json({
      success: true,
      message: "OTP sent successfully, please check your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during registration: " + error.message,
    });
  }
};

exports.verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(403).send({
        success: false,
        message: "All fields are required",
      });
    }

    const otpEntry = await prisma.oTP.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!otpEntry) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const expirationTime = new Date(
      otpEntry.createdAt.getTime() + 5 * 60 * 1000
    );
    if (new Date() > expirationTime) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const { username, password } = req.session.tempUserData;

    const newUser = await prisma.user.create({
      data: { username, email, password },
    });

    await prisma.oTP.delete({ where: { id: otpEntry.id } });

    delete req.session.tempUserData;

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during registration: " + error.message,
    });
  }
};
