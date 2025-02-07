import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/SignUpPage.css"

const SignUpPage = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        username: '',
        password: '',
        role: 'USER',
    });
    const [isChangingBackground, setIsChangingBackground] = useState(false);
    const [errors, setErrors] = useState({});

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
        if (!userDetails.name.trim()) newErrors.name = 'Name cannot be null';
        else if (userDetails.name.trim().length < 2) newErrors.name = 'Name is too short';

        if (!userDetails.surname.trim()) newErrors.surname = 'Surname cannot be null';
        else if (userDetails.surname.trim().length < 2) newErrors.surname = 'Surname is too short';

        if (!userDetails.password.trim()) newErrors.password = 'Password cannot be null';
        else if (userDetails.password.trim().length < 6) newErrors.password = 'Password is too short';

        if (!userDetails.username.trim()) newErrors.username = 'Username cannot be null';
        else if (userDetails.username.trim().length < 6) newErrors.username = 'Username is too short';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                });

                const data = await response.json();

                if (data.token === "UsernameTaken") {
                    setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is already taken' }));
                } else {
                    setIsVisible(false);
                    setIsChangingBackground(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            } catch (error) {
                console.error('There was an error submitting the form:', error);
            }
        }
    };

    const handleRoleToggle = () => {
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            role: prevDetails.role === 'USER' ? 'TRAINER' : 'USER',
        }));
    };

    return (
        <div className={`signup-page ${isChangingBackground ? 'changing-background' : ''}`}>
            <div className={`login-form-container ${isVisible ? 'visible' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div className="signup-page-form-group">
                        <div className="signup-page-toggle-container">
                            <span
                                className={`signup-page-toggle-label ${userDetails.role === 'USER' ? 'active' : ''}`}>Użytkownik</span>
                            <label className="signup-page-switch">
                                <input
                                    type="checkbox"
                                    checked={userDetails.role === 'TRAINER'}
                                    onChange={handleRoleToggle}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span
                                className={`signup-page-toggle-label ${userDetails.role === 'TRAINER' ? 'active' : ''}`}>Trener</span>
                        </div>
                    </div>
                    <div className="signup-page-form-group">
                        {errors.name && <p className="error show">{errors.name}</p>}
                        <label htmlFor="name">Imie</label>
                        <input type="text" name="name" value={userDetails.name} onChange={handleChange}/>
                    </div>
                    <div className="signup-page-form-group">
                        {errors.surname && <p className="error show">{errors.surname}</p>}
                        <label htmlFor="surname">Nazwisko</label>
                        <input type="text" name="surname" value={userDetails.surname} onChange={handleChange}/>
                    </div>
                    <div className="signup-page-form-group">
                        <label htmlFor="address">Adres</label>
                        <input type="text" name="address" value={userDetails.address} onChange={handleChange}/>
                    </div>
                    <div className="signup-page-form-group">
                        {errors.username && <p className="error show">{errors.username}</p>}
                        <label htmlFor="username">Nazwa użytkownika</label>
                        <input type="text" name="username" value={userDetails.username} onChange={handleChange}/>
                    </div>
                    <div className="signup-page-form-group">
                        {errors.password && <p className="error show">{errors.password}</p>}
                        <label htmlFor="password">Hasło</label>
                        <input type="password" name="password" value={userDetails.password} onChange={handleChange}/>
                    </div>
                    <button type="submit">Zarejestruj się</button>
                </form>
                <div className="login-section">
                    <p>Posiadasz konto?</p>
                    <button className="login-button" onClick={() => navigate("/login")}>Zaloguj się</button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
