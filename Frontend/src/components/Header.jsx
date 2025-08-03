import React, { useState } from "react";
import "./Header.css";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="app-header">
            <div className="logo-section">
                <img src="https://media.istockphoto.com/id/1624291952/vector/medical-health-logo-design-illustration.jpg?s=612x612&w=0&k=20&c=RdOq1SRcWwS_12_c5Zg2_QOUz1GD-YwGvfRodtOPN5w=" alt="Hospital Logo" className="logo" />
                <h1>AI Medical Assistant</h1>
            </div>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                <a href="#home" onClick={() => setMenuOpen(false)}>🏠 Home</a>
                <a href="#trending" onClick={() => setMenuOpen(false)}>📊 Trending Diseases</a>
                <a href="#assistant" onClick={() => setMenuOpen(false)}>🤖 AI Assistance</a>
                <a href="#symptoms" onClick={() => setMenuOpen(false)}>🩺 Symptoms Checker</a>
                <a href="#emergency" onClick={() => setMenuOpen(false)}>📞 Emergency Help</a>
            </nav>
        </header>
    );
};

export default Header;
