
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Allow requests from your configured frontend only.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // Allow tools such as curl that don't send an Origin header.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

// Parse JSON requests with a small size limit.
app.use(express.json({ limit: "10kb" }));

// Limit repeated contact-form submissions.
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

// Configure Gmail SMTP.
const emailConfigured =
    Boolean(process.env.EMAIL_USER) &&
    Boolean(process.env.EMAIL_APP_PASSWORD) &&
    Boolean(process.env.CONTACT_RECEIVER);

const transporter = emailConfigured
    ? nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_APP_PASSWORD,
          },
      })
    : null;

// Health-check endpoint.
app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Portfolio Contact API</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: #0f172a;
                        color: #e2e8f0;
                        padding: 50px;
                        text-align: center;
                    }
                    h1 { color: #34d399; }
                    a { color: #38bdf8; }
                </style>
            </head>
            <body>
                <h1>Portfolio Contact API is Running!</h1>
                <p>Your backend server is working correctly.</p>
                <p>
                    Health check:
                    <a href="/api/health">Check API Health</a>
                </p>
            </body>
        </html>
    `);
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio Contact API is running."
    });
});

// Submit a contact message.
app.post("/api/contact", contactLimiter, async (req, res) => {
    if (!emailConfigured) {
        return res.status(503).json({
            success: false,
            message: "The contact service is not configured yet.",
        });
    }

    const { name, email, subject, message } = req.body || {};

    // Check required fields and their types.
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

    // Length limits help reject oversized or abusive submissions.
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

    // Basic email format validation.
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
        await transporter.sendMail({
            from: {
                name: "Portfolio Contact Form",
                address: process.env.EMAIL_USER,
            },

            to: process.env.CONTACT_RECEIVER,

            replyTo: {
                name: cleanName,
                address: cleanEmail,
            },

            subject: `Portfolio message: ${cleanSubject}`,

            // Plain text avoids inserting untrusted form input into HTML.
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
        });

        return res.status(200).json({
            success: true,
            message: "Your message was sent successfully!",
        });
    } catch (error) {
        // Keep credentials and internal error details out of responses.
        console.error("Contact email delivery failed:", error.message);

        return res.status(500).json({
            success: false,
            message:
                "We couldn't send your message right now. Please try again later.",
        });
    }
});

// Handle malformed JSON and other unexpected errors.
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
    console.log(`Contact API running at http://localhost:${PORT}`);
    console.log(
        `Email delivery configured: ${emailConfigured ? "Yes" : "No"}`
    );
});
