import { useEffect, useState } from "react";

const SignUpPage = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        email: '',
        password: ''
    });
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
        if (!userDetails.name.trim()) newErrors.name = ('Name null');
        else if (userDetails.name.trim().length < 2) newErrors.name = ('Name too short');

        if (!userDetails.surname.trim()) newErrors.surname = ('Surname null');
        else if (userDetails.surname.trim().length < 2) newErrors.surname = ('Surname too short');

        if (!userDetails.password.trim()) newErrors.password = ('Password null');
        else if (userDetails.password.trim().length < 6) newErrors.password = ('Password too short');

        if (!userDetails.email.trim()) newErrors.email = ('Email null');
        else if (!/\S+@\S+\.\S+/.test(userDetails.email)) newErrors.email = ('Invalid email');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                });

                const data = await response.text();
            } catch (error) {
                console.error('There was an error submitting the form:', error);
            }
        }
    }

    return (
        <div className="signup-page">
            <div className={`login-form-container ${isVisible ? 'visible' : ''}`}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        {errors.name &&
                            <p className={`error ${errors.name ? 'show' : ''}`}>{errors.name}</p>}
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={userDetails.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.surname &&
                            <p className={`error ${errors.surname ? 'show' : ''}`}>{errors.surname}</p>}
                        <label htmlFor="surname">Surname</label>
                        <input type="text" name="surname" value={userDetails.surname} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" name="address" value={userDetails.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.email && <p className={`error ${errors.email ? 'show' : ''}`}>{errors.email}</p>}
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={userDetails.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        {errors.password &&
                            <p className={`error ${errors.password ? 'show' : ''}`}>{errors.password}</p>}
                        <label htmlFor="password">Password</label>
                        <input type="password" value={userDetails.password} name="password" onChange={handleChange} />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;
