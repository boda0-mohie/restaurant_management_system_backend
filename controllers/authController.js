const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name, email and password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    // don't send password
    const payload = { id: user._id, role: user.role };
    const accessToken = createToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Option: save refresh token in DB or set as httpOnly cookie (recommended)
    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const accessToken = createToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.json({
      message: "Logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err)
        return res.status(401).json({ message: "Invalid refresh token" });

      const newAccess = createToken({ id: payload.id, role: payload.role });
      res.json({ accessToken: newAccess });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
