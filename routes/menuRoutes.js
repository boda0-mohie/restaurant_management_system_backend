const express = require("express");
const {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, authorize } = require('../middleware/authMiddleware');


const router = express.Router();

router.get("/", getMenu);
router.get("/:id", getMenuItem);
router.post("/", protect, authorize("admin"), createMenuItem);
router.put("/:id", protect, authorize("admin"), updateMenuItem);
router.delete("/:id",protect, authorize('admin'), deleteMenuItem);

module.exports = router;
