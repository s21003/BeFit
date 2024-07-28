import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddTrainerPage = () => {
    const navigate = useNavigate();
    const [trainerData, setTrainerData] = useState({
        name: '',
        surname: '',
        address: '',
        specializations: ''
    });

    const handleChange = (e) => {
        setTrainerData({...trainerData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainerData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const trainerPayload = {
            name: trainerData.name,
            surname: trainerData.surname,
            address: trainerData.address,
            specializations: trainerData.specializations
        };

        console.log(JSON.stringify(trainerPayload))

        try {
            const token = localStorage.getItem("token");
            let response = await fetch('http://localhost:8080/trainer/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(trainerPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Trainer added successfully');
                navigate(`/all-trainers`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainers">All Trainers</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={trainerData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <input className="inputStyle" type="text" name="surname" value={trainerData.surname}
                           onChange={handleChange} placeholder="Surname" required/>
                    <input className="inputStyle" type="text" name="address" value={trainerData.address}
                           onChange={handleChange} placeholder="Address" required/>
                    <input className="inputStyle" type="text" name="specializations" value={trainerData.specializations}
                           onChange={handleChange} placeholder="Specializations" required/>
                    <button className="submitButton" type="submit">Add Trainer</button>
                </form>
            </div>
        </div>
    );
};

export default AddTrainerPage;
