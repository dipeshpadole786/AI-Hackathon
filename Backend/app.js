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



// Dummy database of symptom-condition pairs
const conditionsDB = [
    {
        symptoms: ["fever", "cough", "fatigue"],
        condition: "Flu or COVID-19",
        severity: "Moderate",
    },
    {
        symptoms: ["headache", "nausea"],
        condition: "Migraine",
        severity: "Low",
    },
    {
        symptoms: ["chest pain", "shortness of breath"],
        condition: "Possible Heart Issue",
        severity: "High",
    },
    {
        symptoms: ["sore throat", "runny nose"],
        condition: "Common Cold",
        severity: "Low",
    },
    {
        symptoms: ["diarrhea", "vomiting", "abdominal pain"],
        condition: "Food Poisoning",
        severity: "Moderate",
    },
];

// Route to check symptoms
app.post("/check-symptoms", (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
        return res.status(400).json({ result: "Please enter symptoms." });
    }

    const input = symptoms.toLowerCase().split(/[\s,]+/); // split by spaces or commas
    const matched = [];

    for (const entry of conditionsDB) {
        const matchCount = entry.symptoms.reduce((count, symptom) => {
            return input.includes(symptom) ? count + 1 : count;
        }, 0);

        if (matchCount > 0) {
            matched.push({
                condition: entry.condition,
                severity: entry.severity,
                matchedSymptoms: matchCount,
                totalSymptoms: entry.symptoms.length,
            });
        }
    }

    if (matched.length > 0) {
        // Sort by most matched symptoms
        matched.sort((a, b) => b.matchedSymptoms - a.matchedSymptoms);
        return res.json({ result: matched });
    } else {
        return res.json({
            result: "Condition not found. Please consult a doctor.",
        });
    }
});




app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
