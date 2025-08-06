// src/components/Footer.jsx

import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h2>Health<span>AI</span></h2>
                    <p>Your trusted AI healthcare assistant, 24/7.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/homepage">Home</a></li>
                        <li><a href="/trading-disease">Trending Diseases</a></li>
                        <li><a href="/ai-assistance">AI Assistance</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>Email: support@healthai.com</p>
                    <p>Phone: +91 9876543210</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} HealthAI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
