import { useEffect, useState } from "react";

const NearbyHospitals = () => {
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const GEOAPIFY_API_KEY = "67e9e7cd3dda49a9a0005c33aa19b1b8";

    useEffect(() => {
        // Get current location
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });

                const apiUrl = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${longitude},${latitude},5000&limit=10&apiKey=${GEOAPIFY_API_KEY}`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (data.features && data.features.length > 0) {
                        const hospitalList = data.features.map((feature) => ({
                            name: feature.properties.name || "Unnamed Hospital",
                            address: feature.properties.formatted,
                            phone: feature.properties.phone || "Not available",
                        }));
                        setHospitals(hospitalList);
                    } else {
                        setError("No hospitals found nearby.");
                    }
                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch hospital data.");
                }

                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError("Location access denied.");
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="geo-hospital">
            <h2>🏥 Nearby Hospitals</h2>
            {loading && <p>Loading hospitals near you...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {hospitals.length > 0 && (
                <ul>
                    {hospitals.map((h, i) => (
                        <li key={i}>
                            <strong>{h.name}</strong><br />
                            📍 {h.address}<br />
                            📞 <a href={`tel:${h.phone}`}>{h.phone}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NearbyHospitals;
