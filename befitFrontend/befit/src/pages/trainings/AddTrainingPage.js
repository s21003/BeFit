import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddTrainingPage = () => {
    const navigate = useNavigate();
    const [trainingData, setTrainingData] = useState({
        name: '',
    });

    const handleChange = (e) => {
        setTrainingData({...trainingData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainingData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const trainingPayload = {
            name: trainingData.name,
            kcal: trainingData.kcal,
            protein: trainingData.protein,
            fat: trainingData.fat,
        };

        console.log(JSON.stringify(trainingPayload))

        try {
            let response = await fetch('http://localhost:8080/training/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainingPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Product added successfully');
                navigate(`/all-trainings`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainings">All Trainings</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={trainingData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <input className="inputStyle" type="number" step="0.1" name="kcal" value={trainingData.kcal}
                           onChange={handleChange} placeholder="Kcal" required/>
                    <input className="inputStyle" type="protein" step="0.1" name="protein" value={trainingData.protein}
                           onChange={handleChange} placeholder="Proteins" required/>
                    <input className="inputStyle" type="fat" step="0.1" name="fat" value={trainingData.fat}
                           onChange={handleChange} placeholder="Fats" required/>
                    <button className="submitButton" type="submit">Add Training</button>
                </form>
            </div>
        </div>
    );
};

export default AddTrainingPage;
