import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/items/AddItemsPage.css"

const AddProductPage = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        kcal: 0.0,
        protein: 0.0,
        fat: 0.0,
        carbs: 0.0,
        weight: 0.0,
        creatorUsername: ''
    });

    const handleChange = (e) => {
        setProductData({...productData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);

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
            weight: productData.weight,
            creatorUsername: decodedToken.sub
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
                navigate(`/own-products`);
            }
        } catch (error) {
            console.error('Error adding exchange:', error);
        }
    };

    const handleReturn = () => {
        navigate(`/own-products`);
    };

    return (
        <div className="addItems-container">
            <NavBar/>
            <h1>Dodaj nowy produkt</h1>
            <div className="addItems">
                <form onSubmit={handleSubmit} className="addItems-Form">
                    <label>Nazwa produktu</label>
                    <input className="inputStyle" type="text" name="name" value={productData.name}
                           onChange={handleChange} placeholder="Nazwa produktu" required/>
                    <label>Kalorie na 100g</label>
                    <input className="inputStyle" type="number" step="0.1" name="kcal" value={productData.kcal}
                           onChange={handleChange} placeholder="Kcal" required/>
                    <label>Białko na 100g</label>
                    <input className="inputStyle" type="number" step="0.1" name="protein" value={productData.protein}
                           onChange={handleChange} placeholder="Proteins" required/>
                    <label>Tłuszcze na 100g</label>
                    <input className="inputStyle" type="number" step="0.1" name="fat" value={productData.fat}
                           onChange={handleChange} placeholder="Fats" required/>
                    <label>Węglowodany na 100g</label>
                    <input className="inputStyle" type="number" step="0.1" name="carbs" value={productData.carbs}
                           onChange={handleChange} placeholder="Carbs" required/>
                    <label>Waga produktu</label>
                    <input className="inputStyle" type="number" step="0.1" name="weight" value={productData.weight}
                           onChange={handleChange} placeholder="Weight" required/>
                    <div className="addItems-buttons-container">
                        <button className="addItems-add-btn" type="submit">Dodaj produkt</button>
                        <button className="addItems-return-btn" onClick={handleReturn}>Powrót</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
