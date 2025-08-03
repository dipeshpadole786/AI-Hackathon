require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const OPENROUTER_API_KEY = process.env.GEMINI_API_KEY;

app.post("/tobackend", async (req, res) => {
    const { transcript } = req.body;

    if (!transcript)
        return res.status(400).json({ error: "Transcript missing" });

    try {
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: transcript }],
            }),
        });

        const aiData = await aiRes.json();
        const aiText =
            aiData.choices?.[0]?.message?.content ||
            "Sorry, I couldn't understand your request.";

        console.log("🤖 AI replied:", aiText);

        res.json({ message: aiText }); // ✅ Only send text
    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});




// 🚑 Email route
app.post("/send-email", async (req, res) => {
    try {
        const { message, location, name, phone } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"AI Assistant" <${process.env.EMAIL_USER}>`,
            to: process.env.AMBULANCE_EMAIL,
            subject: "🚨 Emergency Alert",
            text: `${message}\n\n🧍 Patient Name: ${name || "Unknown"}\n📞 Phone: ${phone || "N/A"}\n📍 Location: ${location || "Location not available."}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent:", info.messageId);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Email error:", err.message);
        res.status(500).json({ error: "Failed to send email" });
    }
});


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
