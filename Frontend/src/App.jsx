// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/home";   // For /home
import Homepage from "./components/Homepage"; // For /homepage
import Footer from "./components/Footer";
import SymptomChecker from "./components/SymptomChecker";
import NearbyHospitals from "./components/EmergencyHelp";
import TrendingDiseases from "./components/TrendingDiseases";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/cheaker" element={<SymptomChecker />} />
        <Route path="/emergency" element={<NearbyHospitals />} />
        <Route path="/trending" element={<TrendingDiseases />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
