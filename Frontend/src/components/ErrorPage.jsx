import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/homepage");
    };

    return (
        <div className="error-container">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <button onClick={goToHome}>Go to Home</button>
        </div>
    );
};

export default ErrorPage;
