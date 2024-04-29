import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddTrainingSchemaPage = () => {
    const navigate = useNavigate();
    const [trainingSchemaData, setTrainingSchemaData] = useState({
        exercises: ''
    });

    const handleChange = (e) => {
        setTrainingSchemaData({...trainingSchemaData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainingSchemaData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const trainingSchemaPayload = {
            name: trainingSchemaData.name,
            creationDate: trainingSchemaData.creationDate,
            creatorId: trainingSchemaData.creatorId,
        };

        console.log(JSON.stringify(trainingSchemaPayload))

        try {
            let response = await fetch('http://localhost:8080/trainingSchema/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainingSchemaPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('TrainingSchema added successfully');
                navigate(`/all-trainingSchemas`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainingSchemas">All TrainingSchemas</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={trainingSchemaData.exercises}
                           onChange={handleChange} placeholder="Name" required/>
                    <button className="submitButton" type="submit">Add Training schema</button>
                </form>
            </div>
        </div>
    );
};

export default AddTrainingSchemaPage;
