const Order = require("../models/Order")

const getDeliveryDashboard = async (req, res) => {
  try {
    const readyOrders = await Order.find({
      status: "ready"
    }).populate("items.menuItem");

    res.status(200).json({
      readyOrders
    });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


module.exports = {
  getDeliveryDashboard
}