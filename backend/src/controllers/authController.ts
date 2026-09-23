import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "urbanpulse_nexus_local_secret_change_later";

/* =========================================================
   REGISTER
   ========================================================= */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      role,
      department,
    } = req.body;

    /* -----------------------------------------
       Validate required fields
       Username is NOT required from frontend.
       We generate one automatically if missing.
    ----------------------------------------- */

    if (!email || !password || !fullName) {
      res.status(400).json({
        success: false,
        message:
          "Please provide fullName, email, and password",
      });
      return;
    }

    /* -----------------------------------------
       Public registration ALWAYS creates Citizen accounts.
       Prevents public creation of Staff or Admin accounts.
    ----------------------------------------- */
    const enforcedRole = "citizen";

    /* -----------------------------------------
       Normalize data
    ----------------------------------------- */

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const normalizedFullName = String(fullName).trim();

    /* -----------------------------------------
       Check existing email
    ----------------------------------------- */

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    /* -----------------------------------------
       Generate username automatically
       if frontend doesn't send one.
    ----------------------------------------- */

    let finalUsername =
      username && String(username).trim()
        ? String(username).trim()
        : normalizedEmail.split("@")[0];

    finalUsername = finalUsername
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    if (!finalUsername) {
      finalUsername = "citizen";
    }

    /* -----------------------------------------
       Make username unique
    ----------------------------------------- */

    let usernameExists = await User.findOne({
      username: finalUsername,
    });

    let counter = 1;

    while (usernameExists) {
      finalUsername = `${finalUsername}${counter}`;
      counter++;

      usernameExists = await User.findOne({
        username: finalUsername,
      });
    }

    /* -----------------------------------------
       Hash password
    ----------------------------------------- */

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    /* -----------------------------------------
       Create user
    ----------------------------------------- */

    const newUser = await User.create({
      username: finalUsername,
      email: normalizedEmail,
      password: hashedPassword,
      fullName: normalizedFullName,
      role: enforcedRole,
      department: "",
      isActive: true,
    });

    /* -----------------------------------------
       Safe user object
       Never send password to frontend.
    ----------------------------------------- */

    const safeUser = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      department: newUser.department,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    /* -----------------------------------------
       Success
    ----------------------------------------- */

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};


/* =========================================================
   LOGIN
   ========================================================= */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    /* -----------------------------------------
       Validate
    ----------------------------------------- */

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    /* -----------------------------------------
       Find user
    ----------------------------------------- */

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    /* -----------------------------------------
       Check password
    ----------------------------------------- */

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    /* -----------------------------------------
       Check active account
    ----------------------------------------- */

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "User account is inactive",
      });
      return;
    }

    /* -----------------------------------------
       CREATE JWT

       IMPORTANT:
       We include BOTH:
       - id
       - userId

       This makes it compatible with the
       authentication middleware and complaint
       routes.
    ----------------------------------------- */

    const token = jwt.sign(
      {
        id: user._id.toString(),
        userId: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    /* -----------------------------------------
       Safe user
    ----------------------------------------- */

    const safeUser = {
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

    /* -----------------------------------------
       Return token
    ----------------------------------------- */

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};


/* =========================================================
   GET CURRENT USER
   ========================================================= */
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId =
      req.userId ||
      req.user?.userId ||
      req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
      return;
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "User account is inactive",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};