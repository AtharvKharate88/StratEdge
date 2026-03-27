const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const AppError=require("../utils/AppError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");
const logger = require("../utils/logger");




const signup =asyncHandler( async (req, res) => {
  
    const {email,password}=req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user=await User.create({
      email,
      password: hashedPassword,
    });

    logger.info("User signed up", {
      userId: user._id,
      email: user.email,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  
});

const login =asyncHandler( async (req, res) => {
   
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

  // 🔐 store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    logger.info("User logged in", {
      userId: user._id,
    });

  

    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  // verify refresh token signature
  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (err) {
    throw new AppError("Invalid refresh token", 401);
  }
  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Refresh token revoked", 401);
  }

  // issue new access token
  const newAccessToken = generateAccessToken({
    userId: user._id,
  });

  res.json({
    accessToken: newAccessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 400);
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
    logger.info("User logged out", {
      userId: user._id,
    });
  }

  res.json({ message: "Logged out successfully" });
});

module.exports = { signup, login, refresh, logout };