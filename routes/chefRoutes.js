const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { getChefDashboard } = require("../controllers/chefController");

router.get(
  "/dashbourd",
  protect,
  authorize("chef"),
  getChefDashboard
);


module.exports = router;
