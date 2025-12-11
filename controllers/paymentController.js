const Stripe = require("stripe");
require("dotenv").config()
const stripe = Stripe(process.env.STRIPE_SECRET);
const Order = require("../models/Order");
const Payment = require("../models/Payment");

// Create Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const order = await Order.findById(orderId).populate("items.menuItem");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // security: ensure the logged-in user owns the order (unless admin)
    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: not your order" });
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.menuItem.name },
        unit_amount: Math.round(item.menuItem.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { orderId: order._id.toString(), userId: req.user.id },
    });

    // create Payment record (idempotent by stripeSessionId uniqueness)
    await Payment.create({
      order: orderId,
      user: req.user.id,
      stripeSessionId: session.id,
      amount: order.totalPrice,
      currency: "usd",
      status: "pending",
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return res.status(500).json({ err: err.message });
  }
};
