//import "../styles/MainPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        email: '',
        password: ''
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
        else if (userDetails.name.trim().length < 2) newErrors.name = 'Name too short';

        if (!userDetails.surname.trim()) newErrors.surname = 'Surname cannot be null';
        else if (userDetails.surname.trim().length < 2) newErrors.surname = 'Surname too short';

        if (!userDetails.password.trim()) newErrors.password = 'Password cannot be null';
        else if (userDetails.password.trim().length < 6) newErrors.password = 'Password too short';

        if (!userDetails.email.trim()) newErrors.email = 'Email cannot be null';
        else if (!/\S+@\S+\.\S+/.test(userDetails.email)) newErrors.email = 'Invalid email';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // Debugging statement
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
                console.log(data); // Debugging statement

                if (data.token === "EmailTaken") {
                    setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is already taken' }));
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
        } else {
            console.log("Form validation failed", errors); // Debugging statement
        }
    };

    return (
        <div className={`signup-page ${isChangingBackground ? 'changing-background' : ''}`}>
            <div className={`login-form-container ${isVisible ? 'visible' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        {errors.name && <p className="error" aria-live="assertive">{errors.name}</p>}
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={userDetails.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.surname && <p className="error" aria-live="assertive">{errors.surname}</p>}
                        <label htmlFor="surname">Surname</label>
                        <input type="text" name="surname" value={userDetails.surname} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" name="address" value={userDetails.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.email && <p className="error" aria-live="assertive">{errors.email}</p>}
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.password && <p className="error" aria-live="assertive">{errors.password}</p>}
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={userDetails.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
