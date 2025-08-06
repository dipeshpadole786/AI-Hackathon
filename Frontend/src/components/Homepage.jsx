// src/components/Homepage.jsx
import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

const images = [
    "https://www.datocms-assets.com/16499/1707000491-screenshot-2024-02-03-234759.png?auto=format&dpr=0.93&w=1738",
    "https://rejolut.com/wp-content/uploads/2023/08/AI-in-Healthcare.jpg",
    "https://cdn.prod.website-files.com/65f6ba266e0d7c8372e4b4cf/65fbb9aef75b9295ea8d62ac_Banner-image.webp"
];

const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="homepage-container">
            <div className="homepage-text">
                <h1>
                    Welcome to <span className="brand">Healthify</span>
                </h1>
                <p>
                    Empowering lives through innovation in healthcare. Our platform connects you with trusted health resources, AI assistance, and real-time emergency services.
                </p>

                <button className="explore-btn">Explore Services</button>

                <div className="nav-buttons">
                    <button onClick={() => navigate("/trending")}>Trading Disease</button>
                    <button onClick={() => navigate("/home")}>AI Assistance</button>
                    <button onClick={() => navigate("/emergency")}>Emergency Help</button>
                    <button onClick={() => navigate("/cheaker")}>Cheaker</button>
                </div>
            </div>

            <div className="slider-container">
                <img
                    src={images[currentIndex]}
                    alt="AI in healthcare"
                    className="slider-image"
                />
            </div>
        </div>
    );
};

export default Homepage;
