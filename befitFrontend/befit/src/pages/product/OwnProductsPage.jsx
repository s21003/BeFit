import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/items/OwnItemsPage.css"

const OwnProductsPage = () => {
    const navigate = useNavigate();
    const [ownProducts, setOwnProducts] = useState([]);

    useEffect(() => {
        const fetchOwnProducts = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const creatorUsername = decodedToken.sub;

                console.log("User username from token:", creatorUsername, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/product/user/${creatorUsername}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log(data);
                    setOwnProducts(data);
                } catch (error) {
                    console.error("Fetching own products failed: ", error);
                }
            }else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchOwnProducts();
    }, []);

    const handleRowClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddProduct = () => {
        navigate(`/add-product`);
    };

    const handleReturn = () => {
        navigate(`/all-meals`);
    };

    return (
        <div className="ownItems-container">
            <NavBar />
            <div className="ownItems">
                <h2 className="ownHeader">Twoje produkty</h2>
                {ownProducts.length > 0 ? (
                    <div className="ownItems-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Kalorie</th>
                                <th>Białko</th>
                                <th>Tłuszcze</th>
                                <th>Węglowodany</th>
                                <th>Waga</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ownProducts.map(product => (
                                <tr key={product.id} onClick={() => handleRowClick(product.id)}>
                                    <td>{product.name}</td>
                                    <td>{product.kcal}</td>
                                    <td>{product.protein}</td>
                                    <td>{product.fat}</td>
                                    <td>{product.carbs}</td>
                                    <td>{product.weight}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Brak własnych produktów.</p>
                )}
                <div className="ownItems-buttons-container">
                    <button className="ownItems-add-btn" onClick={handleAddProduct}>Dodaj produkt</button>
                    <button className="ownItems-return-btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default OwnProductsPage;