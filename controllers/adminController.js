const User = require("../models/User");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const bcrypt = require("bcrypt");

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// Update User Role By Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// Delete User By Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// Admin Creates Users Manually
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1) Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    const lastOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("items.menuItem");

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      ordersByStatus,
      lastOrders,
      topItems,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUserByAdmin,
  getAdminDashboard,
};
