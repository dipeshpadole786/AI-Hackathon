import { useState } from "react";
import "./SymptomChecker.css";

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [results, setResults] = useState(null);

    const handleCheck = async () => {
        const response = await fetch("http://localhost:3000/check-symptoms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms }),
        });
        const data = await response.json();
        setResults(data.result);
    };

    const handleFindHospital = () => {
        const query = "hospital near me";
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
        window.open(mapsUrl, "_blank");
    };

    return (
        <div className="symptom-checker">
            <h2>🩺 Symptom Checker</h2>

            <textarea
                placeholder="Describe your symptoms (e.g., cough, fever)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />

            <div className="button-group">
                <button onClick={handleCheck}>Check Condition</button>
                <button onClick={handleFindHospital} className="secondary">
                    Find Nearest Hospital
                </button>
            </div>

            <div className="results">
                <h3>🧾 Possible Conditions:</h3>
                {Array.isArray(results) ? (
                    <ul>
                        {results.map((r, i) => (
                            <li key={i}>
                                <strong>{r.condition}</strong> <br />
                                Severity: <span className={`severity ${r.severity.toLowerCase()}`}>{r.severity}</span> <br />
                                Matched Symptoms: {r.matchedSymptoms} / {r.totalSymptoms}
                            </li>
                        ))}
                    </ul>
                ) : results ? (
                    <p>{results}</p>
                ) : null}
            </div>
        </div>
    );
};

export default SymptomChecker;
