import { Router } from "express";
import mongoose from "mongoose";
import { Complaint } from "../models/Complaint";
import { User } from "../models/User";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import { resolveVijayawadaCoordinates } from "./complaintRoutes";

const router = Router();

/**
 * GET /api/admin/complaints
 * Get all complaints for administrators
 */
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("citizen", "fullName email username")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        complaints,
      });
    } catch (error) {
      console.error("GET admin complaints error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch complaints",
      });
    }
  }
);

/**
 * PATCH /api/admin/complaints/:id
 *
 * Admin can update:
 * - assignedDepartment
 * - assignedAgent (validated against real active staff users)
 * - priority
 * - status
 * - slaDueDate
 * - remarks
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
          message: "Invalid complaint ID",
        });
      }

      const {
        assignedDepartment,
        assignedAgent,
        priority,
        status,
        slaDueDate,
        remarks,
      } = req.body;

      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      // Fetch logged-in admin details for activity logging
      const adminUser = await User.findById(req.user?.userId);
      const adminAuthor = adminUser?.fullName || "Samreen Mohmmad";

      const activities = complaint.activities || [];

      /*
       * Assignment & Department Updates
       */
      if (
        assignedDepartment !== undefined ||
        assignedAgent !== undefined
      ) {
        let finalAgentName = complaint.assignedAgent;

        if (assignedAgent !== undefined) {
          const cleanAgentStr = String(assignedAgent).trim();

          if (!cleanAgentStr || cleanAgentStr === "Unassigned") {
            finalAgentName = "Unassigned";
          } else {
            // Find real active staff user by fullName or ObjectId
            const staffUser =
              (await User.findOne({
                fullName: cleanAgentStr,
                role: "staff",
                isActive: true,
              })) ||
              (await User.findOne({
                _id: mongoose.isValidObjectId(cleanAgentStr)
                  ? cleanAgentStr
                  : undefined,
                role: "staff",
                isActive: true,
              }));

            if (!staffUser) {
              return res.status(400).json({
                success: false,
                message: `Selected staff member "${cleanAgentStr}" is invalid or inactive`,
              });
            }

            finalAgentName = staffUser.fullName;
          }
        }

        const departmentChanged =
          assignedDepartment !== undefined &&
          assignedDepartment !== complaint.assignedDepartment;

        const agentChanged =
          assignedAgent !== undefined &&
          finalAgentName !== complaint.assignedAgent;

        if (assignedDepartment !== undefined) {
          complaint.assignedDepartment = String(assignedDepartment).trim();
        }

        if (assignedAgent !== undefined) {
          complaint.assignedAgent = finalAgentName;
        }

        if (departmentChanged || agentChanged) {
          const assignmentNotes: string[] = [];

          if (departmentChanged) {
            assignmentNotes.push(
              `Department updated to "${complaint.assignedDepartment}"`
            );
          }

          if (agentChanged) {
            assignmentNotes.push(
              `Staff agent assigned: "${complaint.assignedAgent}"`
            );
          }

          activities.push({
            timestamp: new Date(),
            author: adminAuthor,
            role: "admin",
            note: assignmentNotes.join(" | "),
          });
        }
      }

      /*
       * Priority Update
       */
      if (priority !== undefined) {
        const allowedPriorities = [
          "low",
          "medium",
          "high",
          "critical",
        ];

        if (!allowedPriorities.includes(priority)) {
          return res.status(400).json({
            success: false,
            message: "Invalid priority value",
          });
        }

        if (priority !== complaint.priority) {
          activities.push({
            timestamp: new Date(),
            author: adminAuthor,
            role: "admin",
            note: `Priority changed from ${complaint.priority} to ${priority}`,
          });

          complaint.priority = priority;
        }
      }

      /*
       * Status Update
       */
      if (status !== undefined) {
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

        if (status !== complaint.status) {
          activities.push({
            timestamp: new Date(),
            author: adminAuthor,
            role: "admin",
            note: `Status changed from ${complaint.status} to ${status}`,
            statusChange: status,
          });

          complaint.status = status;
        }
      }

      /*
       * SLA Due Date Update
       */
      if (slaDueDate !== undefined) {
        const oldSlaStr = complaint.slaDueDate
          ? complaint.slaDueDate.toISOString().split("T")[0]
          : "None";

        if (slaDueDate === null || slaDueDate === "") {
          if (complaint.slaDueDate) {
            activities.push({
              timestamp: new Date(),
              author: adminAuthor,
              role: "admin",
              note: `SLA due date cleared (was ${oldSlaStr})`,
            });
            complaint.slaDueDate = undefined;
          }
        } else {
          const newDate = new Date(slaDueDate);

          if (isNaN(newDate.getTime())) {
            return res.status(400).json({
              success: false,
              message: "Invalid SLA due date format",
            });
          }

          const newSlaStr = newDate.toISOString().split("T")[0];

          if (oldSlaStr !== newSlaStr) {
            activities.push({
              timestamp: new Date(),
              author: adminAuthor,
              role: "admin",
              note: `SLA due date set to ${newSlaStr}`,
            });
            complaint.slaDueDate = newDate;
          }
        }
      }

      /*
       * Remarks Update
       */
      if (remarks !== undefined) {
        const cleanRemarks = String(remarks).trim();
        complaint.remarks = cleanRemarks;

        if (cleanRemarks) {
          activities.push({
            timestamp: new Date(),
            author: adminAuthor,
            role: "admin",
            note: `Admin remark: ${cleanRemarks}`,
          });
        }
      }

      complaint.activities = activities;

      await complaint.save();

      await complaint.populate(
        "citizen",
        "fullName email username"
      );

      return res.status(200).json({
        success: true,
        message: "Complaint updated successfully",
        complaint,
      });
    } catch (error) {
      console.error("PATCH admin complaint error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update complaint",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }
);

/**
 * POST /api/admin/complaints
 *
 * Create a complaint from the admin dashboard on behalf of a registered citizen.
 * Looks up the citizen by fullName to bind complaint.citizen to the real citizen user's _id.
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const {
        citizenName,
        title,
        description,
        category,
        department,
        priority,
        location,
      } = req.body;

      if (!citizenName?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Citizen name is required",
        });
      }

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint title is required",
        });
      }

      if (!description?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint description is required",
        });
      }

      if (!category?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint category is required",
        });
      }

      if (!location?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint location is required",
        });
      }

      const escapedCitizenName = citizenName
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const citizen = await User.findOne({
        fullName: {
          $regex: `^${escapedCitizenName}$`,
          $options: "i",
        },
        role: "citizen",
      });

      if (!citizen) {
        return res.status(404).json({
          success: false,
          message: `Citizen "${citizenName.trim()}" was not found. Please enter the exact registered citizen name.`,
        });
      }

      const allowedPriorities = [
        "low",
        "medium",
        "high",
        "critical",
      ];

      const finalPriority = allowedPriorities.includes(priority)
        ? priority
        : "medium";

      const adminUser = await User.findById(req.user?.userId);
      const adminAuthor = adminUser?.fullName || "Admin User";

      const coordinates = await resolveVijayawadaCoordinates(location.trim());

      const complaint = await Complaint.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        location: location.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        priority: finalPriority,
        status: "pending",
        assignedDepartment: department || "Unassigned",
        assignedAgent: "Unassigned",
        citizen: citizen._id,
        slaDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        activities: [
          {
            timestamp: new Date(),
            author: adminAuthor,
            role: "admin",
            note: `Complaint registered by admin on behalf of citizen ${citizen.fullName}`,
          },
        ],
      });

      await complaint.populate("citizen", "fullName email username");

      return res.status(201).json({
        success: true,
        message: "Complaint created successfully",
        complaint,
      });
    } catch (error) {
      console.error("POST admin complaint error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create complaint",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }
);

/**
 * GET /api/admin/staff
 * Returns active staff users for assignment dropdowns
 */
router.get(
  "/staff",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const staff = await User.find({
        role: "staff",
        isActive: true,
      })
        .select("_id fullName email username department")
        .sort({ fullName: 1 });

      return res.status(200).json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error("GET admin staff error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch staff users",
      });
    }
  }
);

/**
 * GET /api/admin/complaints/stats
 * Returns live operational dashboard statistics
 */
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const totalComplaints = await Complaint.countDocuments();
      const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
      const inProgressComplaints = await Complaint.countDocuments({ status: "in_progress" });
      const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });

      const totalCitizens = await User.countDocuments({ role: "citizen" });
      const totalStaff = await User.countDocuments({ role: "staff", isActive: true });

      return res.status(200).json({
        success: true,
        stats: {
          complaints: {
            total: totalComplaints,
            pending: pendingComplaints,
            inProgress: inProgressComplaints,
            resolved: resolvedComplaints,
          },
          citizensCount: totalCitizens,
          staffCount: totalStaff,
          departmentsCount: 12,
        },
      });
    } catch (error) {
      console.error("GET admin stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin stats",
      });
    }
  }
);

/**
 * GET /api/admin/complaints/citizens
 * Returns registered citizen users for Admin Citizen Management
 */
router.get(
  "/citizens",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const citizens = await User.find({ role: "citizen" })
        .select("_id fullName email username isActive createdAt department")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        citizens,
      });
    } catch (error) {
      console.error("GET admin citizens error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch citizen users",
      });
    }
  }
);

export default router;
