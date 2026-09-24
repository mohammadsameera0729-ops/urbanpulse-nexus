import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import adminComplaintRoutes from "./routes/adminComplaintRoutes";
import staffComplaintRoutes from "./routes/staffComplaintRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import cameraRoutes from "./routes/cameraRoutes";
import trafficRoutes from "./routes/trafficRoutes";
import trafficIncidentRoutes from "./routes/trafficIncidentRoutes";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
                return callback(null, true);
            }

            if (/\.vercel\.app$/.test(origin) || origin === "https://vercel.app") {
                return callback(null, true);
            }

            if (allowedOrigins.length > 0 && (allowedOrigins.includes(origin) || allowedOrigins.includes("*"))) {
                return callback(null, true);
            }

            callback(null, true);
        },
        credentials: true,
    })
);

/* ---------------- MIDDLEWARE ---------------- */

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);
app.use("/api/staff/complaints", staffComplaintRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/cameras", cameraRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/traffic", trafficIncidentRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "UrbanPulse Nexus Backend is running 🚦",
    });
});

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Backend is working",
    });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

export default app;