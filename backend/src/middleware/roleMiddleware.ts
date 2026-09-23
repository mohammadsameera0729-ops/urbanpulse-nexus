import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

type UserRole = "citizen" | "staff" | "admin";

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
