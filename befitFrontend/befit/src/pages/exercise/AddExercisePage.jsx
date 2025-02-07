import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import "../../styles/items/AddItemsPage.css"
import NavBar from "../../components/NavBar";

const AddExercisePage = () => {
    const navigate = useNavigate();
    const [exerciseData, setExerciseData] = useState({
        name: '',
        part: '',
        videoLink: '',
        creatorUsername: ''
    });

    const handleChange = (e) => {
        setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);

        if (!exerciseData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        let videoLink = exerciseData.videoLink;

        if (videoLink && !videoLink.startsWith('http://') && !videoLink.startsWith('https://')) {
            videoLink = 'http://' + videoLink;
        }

        const exercisePayload = {
            name: exerciseData.name,
            part: parts[exerciseData.part] || null,
            videoLink: videoLink || '',
            creatorUsername: decodedToken.sub
        };

        console.log(JSON.stringify(exercisePayload));

        try {
            const response = await fetch('http://localhost:8080/exercise/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(exercisePayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Exercise added successfully');
                navigate(`/own-exercises`);
            }
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    const handleReturn = () => {
        navigate(`/own-exercises`);
    };

    const parts = {
        "Klatka piersiowa": "KLATKAPIERSIOWA",
        "Biceps": "BICEPS",
        "Triceps": "TRICEPS",
        "Brzuch": "BRZUCH",
        "Plecy": "PLECY",
        "Barki": "BARKI",
        "Nogi": "NOGI",
        "Cardio": "CARDIO",
    };

    return (
        <div className="addItems-container">
            <NavBar/>
            <h1>Dodaj nowe ćwiczenie</h1>
            <div className="addItems">
                <form onSubmit={handleSubmit} className="addItems-Form">
                    <label>Nazwa ćwiczenia</label>
                    <input
                        className="inputStyle"
                        type="text"
                        name="name"
                        value={exerciseData.name}
                        onChange={handleChange}
                        placeholder="Nazwa ćwiczenia"
                        required
                    />
                    <label>Partia ciała</label>
                    <select
                        className="inputStyle"
                        name="part"
                        value={exerciseData.part}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Wybierz partię --</option>
                        {Object.keys(parts).map(partName => (
                            <option key={partName} value={partName}>{partName}</option>
                        ))}
                    </select>
                    <label>Link do wideo</label>
                    <input
                        className="inputStyle"
                        type="text"
                        name="videoLink"
                        value={exerciseData.videoLink}
                        onChange={handleChange}
                        placeholder="Link do wideo (opcjonalnie)"
                    />
                    <div className="addItems-buttons-container">
                        <button className="addItems-add-btn" type="submit">Dodaj ćwiczenie</button>
                        <button className="addItems-return-btn" onClick={handleReturn}>Powrót</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExercisePage;
