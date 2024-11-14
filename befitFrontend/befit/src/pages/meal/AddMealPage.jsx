import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddMealPage = () => {
    const navigate = useNavigate();
    const [mealData, setMealData] = useState({
        name: '',
        kcal: 0.0,
        protein: 0.0,
        fat: 0.0,
        carbs: 0.0,
        weight: 0.0
    });

    const handleChange = (e) => {
        setMealData({...mealData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mealData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const mealPayload = {
            name: mealData.name,
            kcal: mealData.kcal,
            protein: mealData.protein,
            fat: mealData.fat,
        };

        console.log(JSON.stringify(mealPayload))

        try {
            let response = await fetch('http://localhost:8080/meal/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Product added successfully');
                navigate(`/all-meals`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-meals">All Meals</Link>
            </nav>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={mealData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <input className="inputStyle" type="number" step="0.1" name="kcal" value={mealData.kcal}
                           onChange={handleChange} placeholder="Kcal" required/>
                    <input className="inputStyle" type="protein" step="0.1" name="protein" value={mealData.protein}
                           onChange={handleChange} placeholder="Proteins" required/>
                    <input className="inputStyle" type="fat" step="0.1" name="fat" value={mealData.fat}
                           onChange={handleChange} placeholder="Fats" required/>
                    <button className="submitButton" type="submit">Add Meal</button>
                </form>
            </div>
        </div>
    );
};

export default AddMealPage;
