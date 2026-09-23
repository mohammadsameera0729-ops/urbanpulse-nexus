import { Router } from "express";
import mongoose from "mongoose";
import { Complaint } from "../models/Complaint";
import { User } from "../models/User";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/staff/complaints
 * Get complaints assigned to the authenticated staff member
 */
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const staff = req.user;

      if (!staff?.userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      // Load actual staff user document from MongoDB
      const staffUser = await User.findById(staff.userId);

      if (!staffUser || staffUser.role !== "staff" || !staffUser.isActive) {
        return res.status(403).json({
          success: false,
          message: "Staff access required",
        });
      }

      // Query complaints assigned to this staff member's fullName
      const complaints = await Complaint.find({
        assignedAgent: staffUser.fullName,
      })
        .populate("citizen", "fullName email username")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        complaints,
      });
    } catch (error) {
      console.error("GET staff complaints error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch staff complaints",
      });
    }
  }
);

/**
 * PATCH /api/staff/complaints/:id
 * Staff update status & remarks for complaints assigned to them
 */
router.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const staff = req.user;

      if (!staff?.userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      // Verify authenticated user is an active staff user
      const staffUser = await User.findById(staff.userId);

      if (!staffUser || staffUser.role !== "staff" || !staffUser.isActive) {
        return res.status(403).json({
          success: false,
          message: "Staff access required",
        });
      }

      const { id } = req.params;

      // Validate MongoDB ObjectId format
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint ID",
        });
      }

      // Check if request body attempts to modify admin-only fields
      const forbiddenAdminFields = [
        "citizen",
        "assignedAgent",
        "assignedDepartment",
        "priority",
        "slaDueDate",
      ];

      for (const field of forbiddenAdminFields) {
        if (req.body[field] !== undefined) {
          return res.status(403).json({
            success: false,
            message: `Staff is not authorized to modify administrative field: ${field}`,
          });
        }
      }

      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      // Authorization check: Staff can only update complaints assigned to them
      if (complaint.assignedAgent !== staffUser.fullName) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only update complaints assigned to you",
        });
      }

      const { status, remarks } = req.body;
      const activities = complaint.activities || [];
      const activityNotes: string[] = [];
      let newStatusValue: string | undefined = undefined;

      /*
       * Status Update Validation & Forward Transition Enforcement
       */
      if (status !== undefined && status !== complaint.status) {
        const allowedStatuses = [
          "pending",
          "in_progress",
          "under_review",
          "resolved",
          "rejected",
        ];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid complaint status",
          });
        }

        if (status === "rejected") {
          return res.status(400).json({
            success: false,
            message: "Staff cannot reject complaints. Rejection requires admin authorization.",
          });
        }

        // Forward status transition mapping
        const allowedTransitions: Record<string, string[]> = {
          pending: ["in_progress"],
          in_progress: ["under_review"],
          under_review: ["resolved"],
        };

        const validNextStatuses = allowedTransitions[complaint.status];

        if (!validNextStatuses || !validNextStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status transition from "${complaint.status}" to "${status}". Staff can only move status forward (pending -> in_progress -> under_review -> resolved).`,
          });
        }

        activityNotes.push(
          `Complaint status changed from ${complaint.status} to ${status}`
        );
        complaint.status = status;
        newStatusValue = status;
      }

      /*
       * Remarks Update
       */
      if (remarks !== undefined) {
        const cleanRemarks = String(remarks).trim();
        complaint.remarks = cleanRemarks;
        if (cleanRemarks) {
          activityNotes.push(`Staff updated complaint remarks: "${cleanRemarks}"`);
        }
      }

      /*
       * Activity Logging
       */
      if (activityNotes.length > 0) {
        activities.push({
          timestamp: new Date(),
          author: staffUser.fullName,
          role: "staff",
          note: activityNotes.join(" | "),
          statusChange: newStatusValue,
        });
        complaint.activities = activities;
      }

      await complaint.save();

      await complaint.populate("citizen", "fullName email username");

      return res.status(200).json({
        success: true,
        message: "Complaint updated successfully",
        complaint,
      });
    } catch (error) {
      console.error("PATCH staff complaint error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update complaint",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;