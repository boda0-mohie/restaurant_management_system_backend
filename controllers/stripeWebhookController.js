const Stripe = require("stripe");
require("dotenv").config()
const stripe = Stripe(process.env.STRIPE_SECRET);
const Payment = require("../models/Payment");
const Order = require("../models/Order");

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // handle events we care about
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const orderId = session.metadata?.orderId;

      console.log("Webhook: checkout.session.completed", {
        sessionId,
        orderId,
      });

      // find payment by session id
      const payment = await Payment.findOne({ stripeSessionId: sessionId });

      if (!payment) {
        console.warn("Payment record not found for session:", sessionId);
        // optionally create a payment record here if you did not create when session created
      } else if (payment.status === "paid") {
        console.log("Payment already processed, skipping (idempotent).");
      } else {
        // update payment
        payment.status = "paid";
        payment.stripePaymentIntentId =
          session.payment_intent || payment.stripePaymentIntentId;
        await payment.save();

        // update order if exists and not already paid
        if (orderId) {
          const order = await Order.findById(orderId);
          if (order && order.status !== "paid") {
            order.status = "paid";
            await order.save();
          }
        }
        console.log(
          "Payment and Order updated to paid for session:",
          sessionId
        );
      }
    }

    // you can handle other events: payment_intent.succeeded, charge.refunded, etc.

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send();
  }
};
