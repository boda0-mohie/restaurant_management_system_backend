const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUserByAdmin,
} = require("../controllers/adminController");

// Admin Routes
router.get("/users", protect, authorize("admin"), getAllUsers);
router.patch("/users/:id/role", protect, authorize("admin"), updateUserRole);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.post("/users", protect, authorize("admin"), createUserByAdmin);

module.exports = router;
