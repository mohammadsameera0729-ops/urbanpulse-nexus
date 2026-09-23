import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    role?: string;
  };
  userId?: string;
}

interface JwtPayload {
  id: string;
  userId?: string;
  role?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
    return;
  }

  const secret =
    process.env.JWT_SECRET ||
    "urbanpulse_nexus_local_secret_change_later";

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token: user ID missing",
      });
      return;
    }

    req.user = {
      id: userId,
      userId: userId,
      role: decoded.role,
    };

    req.userId = userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};