// src/App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/home";
import Homepage from "./components/Homepage";
import Footer from "./components/Footer";
import SymptomChecker from "./components/SymptomChecker";
import NearbyHospitals from "./components/EmergencyHelp";
import TrendingDiseases from "./components/TrendingDiseases";
import ErrorPage from "./components/ErrorPage";
import { useEffect } from "react";

// Wrapper to access `useLocation` inside <Router>
const AppWrapper = () => {
  const location = useLocation();

  // Define paths where Header/Footer should be hidden
  const hideLayoutPaths = ["*"]; // `*` will match unknown paths
  const isErrorPage = location.pathname !== "/home" &&
    location.pathname !== "/homepage" &&
    location.pathname !== "/cheaker" &&
    location.pathname !== "/emergency" &&
    location.pathname !== "/trending";

  return (
    <>
      {!isErrorPage && <Header />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/cheaker" element={<SymptomChecker />} />
        <Route path="/emergency" element={<NearbyHospitals />} />
        <Route path="/trending" element={<TrendingDiseases />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {!isErrorPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
