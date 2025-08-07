import { useState } from "react";
import "./SymptomChecker.css";

const SymptomChecker = () => {
    const [symptom, setSymptom] = useState("");
    const [language, setLanguage] = useState("English"); // Default language
    const [result, setResult] = useState(null);

    const handleCheck = async () => {
        try {
            const response = await fetch("http://localhost:3000/check-symptoms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptom, language }),
            });

            const data = await response.json();
            setResult(data.first_aid || data.message || "No data found.");
        } catch (err) {
            console.error("Error:", err);
            setResult("Something went wrong. Please try again.");
        }
    };

    const handleFindHospital = () => {
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent("hospital near me")}`;
        window.open(mapsUrl, "_blank");
    };

    return (
        <div className="symptom-checker">
            <h2>🩺 Symptom Checker</h2>

            <input
                type="text"
                placeholder="Enter your symptom (e.g., Shortness of breath)"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
            />

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
            </select>

            <div className="button-group">
                <button onClick={handleCheck}>Check Condition</button>
                <button onClick={handleFindHospital} className="secondary">
                    Find Nearest Hospital
                </button>
            </div>

            <div className="results">
                <h3>🧾 First Aid Information:</h3>
                {result && <p>{result}</p>}
            </div>
        </div>
    );
};

export default SymptomChecker;
