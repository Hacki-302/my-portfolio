require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Resend } = require("resend");

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const emailConfigured = Boolean(
    resend &&
    process.env.CONTACT_RECEIVER &&
    process.env.RESEND_FROM_EMAIL
);

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(express.json({ limit: "10kb" }));

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many messages. Please try again in 15 minutes.",
    },
});

app.get("/", (req, res) => {
    res.send("Portfolio Contact API is running!");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio Contact API is running.",
    });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
    if (!emailConfigured) {
        return res.status(503).json({
            success: false,
            message: "The contact service is not configured yet.",
        });
    }

    const { name, email, subject, message } = req.body || {};

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof subject !== "string" ||
        typeof message !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Please complete all fields correctly.",
        });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (
        cleanName.length < 2 ||
        cleanName.length > 100 ||
        cleanSubject.length < 2 ||
        cleanSubject.length > 150 ||
        cleanMessage.length < 10 ||
        cleanMessage.length > 5000
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Check your entries. Name and subject must be valid, " +
                "and your message must contain 10–5000 characters.",
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        cleanEmail.length > 254 ||
        !emailPattern.test(cleanEmail)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
        });
    }

    try {
        const { data, error } = await resend.emails.send(
            {
                from: process.env.RESEND_FROM_EMAIL,
                to: [process.env.CONTACT_RECEIVER],
                replyTo: cleanEmail,
                subject: `Portfolio message: ${cleanSubject}`,
                text: [
                    "New message from your portfolio website",
                    "",
                    `Name: ${cleanName}`,
                    `Email: ${cleanEmail}`,
                    `Subject: ${cleanSubject}`,
                    "",
                    "Message:",
                    cleanMessage,
                ].join("\n"),
            },
            {
                signal: AbortSignal.timeout(15000),
            }
        );

        if (error) {
            console.error(
                "Resend email API error:",
                error.statusCode,
                error.message
            );

            return res.status(502).json({
                success: false,
                message:
                    "The email service could not send your message. " +
                    "Please try again later.",
            });
        }

        console.log("Contact email accepted by Resend:", data?.id);

        return res.status(200).json({
            success: true,
            message: "Your message was sent successfully!",
        });
    } catch (error) {
        console.error("Contact email request failed:", error.message);

        return res.status(502).json({
            success: false,
            message:
                "The email service is temporarily unavailable. " +
                "Please try again later.",
        });
    }
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid request data.",
        });
    }

    if (err.message === "Origin not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "This website is not allowed to submit messages.",
        });
    }

    console.error("Server error:", err.message);

    return res.status(500).json({
        success: false,
        message: "An unexpected server error occurred.",
    });
});

app.listen(PORT, () => {
    console.log(`Contact API running on port ${PORT}`);
    console.log(
        `Email delivery configured: ${emailConfigured ? "Yes" : "No"}`
    );
});