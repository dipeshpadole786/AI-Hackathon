import React from "react";
import "./TrendingDiseases.css";

const TrendingDiseases = () => {
    const trends = [
        { name: "Dengue", region: "Mumbai, India", cases: "High", status: "Spreading", severity: "high" },
        { name: "Swine Flu", region: "Pune, India", cases: "Medium", status: "Under Observation", severity: "moderate" },
        { name: "COVID-19", region: "Delhi, India", cases: "Low", status: "Controlled", severity: "low" },
        { name: "Chikungunya", region: "Nagpur, India", cases: "Medium", status: "Localized", severity: "moderate" },
    ];

    return (
        <div className="trending-diseases">
            <h2>🦠 Trending Diseases</h2>
            <table>
                <thead>
                    <tr>
                        <th>Disease</th>
                        <th>Region</th>
                        <th>Cases</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {trends.map((disease, index) => (
                        <tr key={index} className={disease.severity}>
                            <td>{disease.name}</td>
                            <td>{disease.region}</td>
                            <td>{disease.cases}</td>
                            <td>{disease.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrendingDiseases;
