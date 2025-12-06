const Order = require("../models/Order");
const User = require("../models/User");

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // This function to Get all user orders
    const orders = await Order.find({ user: userId })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    // This Function To Display total Spent Money
    const totalSpent = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // This Function Display Activity Orders
    const activeOrders = orders.filter((o) => o.status !== "completed");

    // This Function To Display Last Order
    const lastOrder = orders[0] || null;

    res.status(200).json({
      user: {
        id: req.user.id,
        role: req.user.role,
      },
      stats: {
        totalOrders: orders.length,
        completedOrders: orders.filter((o) => o.status === "completed").length,
        totalSpent,
      },
      activeOrders,
      lastOrder,
      orderHistory: orders,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getUserDashboard,
};
