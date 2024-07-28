import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "../../styles/MainPage.css";

const AddProductPage = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        kcal: 0.0,
        protein: 0.0,
        fat: 0.0,
        carbs: 0.0,
        weight: 0.0
    });

    const handleChange = (e) => {
        setProductData({...productData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const productPayload = {
            name: productData.name,
            kcal: productData.kcal,
            protein: productData.protein,
            fat: productData.fat,
            carbs: productData.carbs,
            weight: productData.weight
        };

        console.log(JSON.stringify(productPayload))

        try {
            const token = localStorage.getItem("token");
            let response = await fetch('http://localhost:8080/product/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (response.ok) {
                alert('Product added successfully');
                navigate(`/all-products`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-products">All Products</Link>
            </nav>
            <div className="editFormContainer">0
                <form onSubmit={handleSubmit} className="editForm">
                    <input className="inputStyle" type="text" name="name" value={productData.name}
                           onChange={handleChange} placeholder="Name" required/>
                    <input className="inputStyle" type="number" step="0.1" name="kcal" value={productData.kcal}
                           onChange={handleChange} placeholder="Kcal" required/>
                    <input className="inputStyle" type="number" step="0.1" name="protein" value={productData.protein}
                           onChange={handleChange} placeholder="Proteins" required/>
                    <input className="inputStyle" type="number" step="0.1" name="fat" value={productData.fat}
                           onChange={handleChange} placeholder="Fats" required/>
                    <input className="inputStyle" type="number" step="0.1" name="carbs" value={productData.carbs}
                           onChange={handleChange} placeholder="Carbs" required/>
                    <input className="inputStyle" type="number" step="0.1" name="weight" value={productData.weight}
                           onChange={handleChange} placeholder="Weight" required/>
                    <button className="submitButton" type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
