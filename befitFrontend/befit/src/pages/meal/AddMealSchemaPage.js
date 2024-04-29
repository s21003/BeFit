import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddMealSchemaPage = () => {
    const navigate = useNavigate();
    const [mealSchemaData, setMealSchemaData] = useState({
        name: '',
        kcal: 0.0,
        protein: 0.0,
        fat: 0.0,
        carbs: 0.0,
        weight: 0.0
    });

    const handleChange = (e) => {
        setMealSchemaData({...mealSchemaData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mealSchemaData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const mealSchemaPayload = {
            name: mealSchemaData.name,
            kcal: mealSchemaData.kcal,
            protein: mealSchemaData.protein,
            fat: mealSchemaData.fat,
        };

        console.log(JSON.stringify(mealSchemaPayload))

        try {
            let response = await fetch('http://localhost:8080/mealSchema/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealSchemaPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('MealSchema added successfully');
                navigate(`/all-mealSchemas`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-mealSchemas">All MealSchemas</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={mealSchemaData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <button className="submitButton" type="submit">Add MealSchema</button>
                </form>
            </div>
        </div>
    );
};

export default AddMealSchemaPage;
