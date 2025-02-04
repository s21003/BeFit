import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/LoginPage.css";

const LoginPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!userDetails.username.trim()) newErrors.username = 'Username null';
        else if (userDetails.username.trim().length < 3) newErrors.username = 'Nazwa użytkownika zbyt krótka';

        if (!userDetails.password.trim()) newErrors.password = 'Password null';
        else if (userDetails.password.trim().length < 6) newErrors.password = 'Hasło zbyt krótkie';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/auth/authenticate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                });

                const data = await response.json();
                localStorage.setItem('token', data.token.trim());
                navigate("/home");
            } catch (error) {
                setErrors({ ...errors, username: 'Wrong Details' });
            }
        }
    };

    return (
        <div className="login-page">
            <div className={`login-form-container ${isVisible ? 'visible' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div className="login-page-form-group">
                        {errors.username && <p className={`error ${errors.username ? 'show' : ''}`}>{errors.username}</p>}
                        <label htmlFor="username">Nazwa użytkownika:</label>
                        <input type="text" name="username" value={userDetails.username} onChange={handleChange} />
                    </div>
                    <div className="login-page-form-group">
                        {errors.password && <p className={`error ${errors.password ? 'show' : ''}`}>{errors.password}</p>}
                        <label htmlFor="password">Hasło:</label>
                        <input type="password" name="password" value={userDetails.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Zaloguj się</button>
                </form>
                <div className="register-section">
                    <p>Nie posiadasz konta?</p>
                    <button className="register-button" onClick={() => navigate("/signup")}>Zarejestruj się</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
