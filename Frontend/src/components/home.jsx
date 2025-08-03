import { useState } from "react";
import TranscriptBox from "./TranscriptBox";
import "./Home.css";

const Home = () => {
    const [transcript, setTranscript] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [listening, setListening] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const [emergencyMessage, setEmergencyMessage] = useState("");
    const [emergencyDescription, setEmergencyDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");

    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "hi-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setListening(true);
        recognition.onerror = (e) => {
            console.error("Speech recognition error:", e.error);
            setListening(false);
        };
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setTranscript(spokenText);
            checkForEmergency(spokenText);
            sendToBackend(spokenText);
        };

        recognition.start();
    };

    const checkForEmergency = (text) => {
        const emergencyKeywords = [
            "heart attack", "attack", "emergency", "behosh", "unconscious", "चक्कर", "गिर गया", "heartattack", "दिक्कत"
        ];

        const lower = text.toLowerCase();
        const matched = emergencyKeywords.some(keyword => lower.includes(keyword.toLowerCase()));

        if (matched) {
            setIsEmergency(true);
            setEmergencyDescription(`🚑 Medical Emergency Detected: "${text}"`);
        } else {
            setIsEmergency(false);
            setEmergencyDescription("");
        }
    };

    const sendToBackend = async (userText) => {
        try {
            const res = await fetch("http://localhost:3000/tobackend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: userText }),
            });

            const data = await res.json();
            const aiText = data.message;
            setAiResponse(aiText);
        } catch (err) {
            console.error("Error from backend:", err);
        }
    };

    const handleAmbulanceDecision = (send) => {
        if (send) {
            setShowForm(true);
        } else {
            setEmergencyMessage("🚫 Ambulance request cancelled.");
            setIsEmergency(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                try {
                    const res = await fetch("http://localhost:3000/send-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: emergencyDescription || "🚨 Emergency detected.",
                            location: locationLink,
                            name: patientName,
                            phone: patientPhone,
                        }),
                    });

                    const data = await res.json();
                    if (data.success) {
                        setEmergencyMessage("✅ Ambulance request sent with user info and location.");
                    } else {
                        setEmergencyMessage("❌ Failed to send email.");
                    }
                } catch (err) {
                    console.error("Email error:", err);
                    setEmergencyMessage("❌ Network error.");
                }

                setShowForm(false);
                setIsEmergency(false);
                setPatientName("");
                setPatientPhone("");
            },
            (error) => {
                console.error("Geolocation error:", error);
                setEmergencyMessage("❌ Unable to get location.");
                setShowForm(false);
                setIsEmergency(false);
            }
        );
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "650px", margin: "0 auto", backgroundColor: "#e6f3ff", borderRadius: "12px" }}>
            <h1 style={{ textAlign: "center", color: "#0077cc" }}>🏥 Health Assistant</h1>
            <p style={{ textAlign: "center", fontSize: "1rem", color: "#333" }}>
                Please ask <strong>medical or emergency-related</strong> questions only.
            </p>

            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <button
                    onClick={handleMicClick}
                    style={{
                        padding: "0.7rem 1.5rem",
                        fontSize: "1rem",
                        background: listening ? "#d9534f" : "#5cb85c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    🎤 {listening ? "Listening..." : "Start Speaking"}
                </button>
            </div>

            <TranscriptBox transcript={transcript} response={aiResponse} />

            {isEmergency && !showForm && (
                <div style={{ marginTop: "1rem", background: "#fff3f3", padding: "1rem", borderRadius: "8px", border: "1px solid #f5c6cb" }}>
                    <p style={{ fontWeight: "bold", color: "#c82333" }}>🚨 Emergency Detected</p>
                    <p>Would you like to send an ambulance to your location?</p>
                    <button onClick={() => handleAmbulanceDecision(true)} style={buttonStyle("#28a745")}>
                        ✅ Yes, Send Ambulance
                    </button>
                    <button onClick={() => handleAmbulanceDecision(false)} style={buttonStyle("#6c757d")}>
                        ❌ No, Cancel
                    </button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleFormSubmit} style={{ marginTop: "1rem", background: "#ffffff", padding: "1.2rem", borderRadius: "8px", border: "1px solid #ccc" }}>
                    <label>
                        Patient Name:
                        <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <br />
                    <label>
                        Contact Number:
                        <input
                            type="tel"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <br />
                    <button type="submit" style={buttonStyle("#007bff")}>📤 Submit Request</button>
                </form>
            )}

            {emergencyMessage && (
                <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#333" }}>{emergencyMessage}</p>
            )}
        </div>
    );
};

const buttonStyle = (bgColor) => ({
    padding: "0.6rem 1rem",
    margin: "0.5rem",
    backgroundColor: bgColor,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
});

const inputStyle = {
    padding: "0.5rem",
    margin: "0.5rem 0",
    width: "100%",
    maxWidth: "300px",
    display: "block",
    borderRadius: "5px",
    border: "1px solid #ccc",
};

export default Home;
