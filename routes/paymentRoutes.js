const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { stripeWebhook } = require('../controllers/stripeWebhookController');
const { protect } = require('../middleware/authMiddleware');

// Create checkout session (protected)
router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook -> IMPORTANT: use raw body parsing here. No auth.
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
