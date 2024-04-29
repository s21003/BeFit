import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddExercisePage = () => {
    const navigate = useNavigate();
    const [exerciseData, setExerciseData] = useState({
        name: '',
        kcal: null,
        protein: null,
        fat: null
    });

    const handleChange = (e) => {
        setExerciseData({...exerciseData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!exerciseData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const exercisePayload = {
            name: exerciseData.name,
            part: exerciseData.part,
            videoLink: exerciseData.videoLink,
            series: exerciseData.series
        };

        console.log(JSON.stringify(exercisePayload))

        try {
            let response = await fetch('http://localhost:8080/exercise/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exercisePayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Exercise added successfully');
                navigate(`/all-exercises`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-exercises">All Exercises</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={exerciseData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <select className="inputStyle" name="part" value={exerciseData.part} onChange={handleChange}
                            required>
                        <option value="">Select Part</option>
                        <option value="KlatkaPiersiowa">Klatka piersiowa</option>
                        <option value="Biceps">Biceps</option>
                        <option value="Triceps">Triceps</option>
                        <option value="Brzuch">Brzuch</option>
                        <option value="Plecy">Plecy</option>
                        <option value="Barki">Barki</option>
                        <option value="Nogi">Nogi</option>
                        <option value="Cardio">Cardio</option>
                    </select>
                    <input className="inputStyle" type="url" name="videoLink" value={exerciseData.videoLink}
                           onChange={handleChange} placeholder="Link"/>
                    <input className="inputStyle" type="text" name="series" value={exerciseData.series}
                           onChange={handleChange} placeholder="Serie"/>
                    <button className="submitButton" type="submit">Add Exercise</button>
                </form>
            </div>
        </div>
    );
};

export default AddExercisePage;
