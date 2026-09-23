import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

/**
 * GET /api/admin/users
 * Returns all registered users (citizens, staff, admins) for Admin User Management
 */
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const users = await User.find()
        .select("_id username email fullName role department isActive createdAt updatedAt")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.error("GET /api/admin/users error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user directory",
      });
    }
  }
);

/**
 * PATCH /api/admin/users/:id
 * Update user status (isActive) or department/role
 */
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      const { isActive, role, department } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Safeguard: Prevent admin deactivating their own active account or the sole active admin
      if (user.role === "admin" && isActive === false) {
        if (req.user?.userId === id) {
          return res.status(400).json({
            success: false,
            message: "You cannot deactivate your own active admin account",
          });
        }
        const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
        if (activeAdminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot deactivate the primary administrative user",
          });
        }
      }

      if (typeof isActive === "boolean") {
        user.isActive = isActive;
      }
      if (role && ["citizen", "staff", "admin"].includes(role)) {
        user.role = role;
      }
      if (typeof department === "string") {
        user.department = department;
      }

      await user.save();

      const updatedUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json({
        success: true,
        message: `User status updated to ${user.isActive ? "active" : "suspended"}`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("PATCH /api/admin/users/:id error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user status",
      });
    }
  }
);

export default router;
