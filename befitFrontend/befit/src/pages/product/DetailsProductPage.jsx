import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import "../../styles/DetailsItemsPage.css"
import NavBar from "../../components/NavBar";

const DetailsProductPage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [productDetails, setProductDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        name: '',
        kcal: 0.0,
        protein: 0.0,
        fat: 0.0,
        carbs: 0.0,
        weight: 0.0
    });
    const [isEditing, setIsEditing] = useState(false); // Track edit mode

    useEffect(() => {
        const fetchProductDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/product/${id}`, {
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
                setProductDetails(data);
            } catch (error) {
                console.error("Fetching product details failed: ", error);
                setProductDetails(null);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditFormData({
            name: productDetails.name,
            kcal: productDetails.kcal,
            protein: productDetails.protein,
            fat: productDetails.fat,
            carbs: productDetails.carbs,
            weight: productDetails.weight
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const updatedData = { id: productDetails.id, ...editFormData };
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/product/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Product updated successfully');
                navigate("/own-products");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Updating product details failed: ", error);
        }
    };

    const handleDelete = async () => {
        const deletedData = { id: productDetails.id, ...editFormData };
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:8080/product/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(deletedData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Successfully deleted product");
                navigate('/own-products');
            } catch (error) {
                console.error("Delete product failed: ", error);
            }
        }
    };

    const handleReturn = () => {
        navigate(`/own-products`);
    }

    return (
        <div className="detailsItems-container">
            <NavBar />
            <div className="detailsItems">
                <h2 className="detailsHeader">Szczegóły produktu</h2>
                {productDetails ? (
                    <>
                        {!isEditing && (
                            <>
                                <div className="detailsContent"><strong>Nazwa produktu:</strong> {productDetails.name}</div>
                                <div className="detailsContent"><strong>Kalorie:</strong> {productDetails.kcal}</div>
                                <div className="detailsContent"><strong>Białko:</strong> {productDetails.protein}</div>
                                <div className="detailsContent"><strong>Tłuszcze:</strong> {productDetails.fat}</div>
                                <div className="detailsContent"><strong>Węglowodany:</strong> {productDetails.carbs}</div>
                                <div className="detailsContent"><strong>Waga:</strong> {productDetails.weight}</div>
                            </>
                        )}

                        {/* Show edit form when in edit mode */}
                        {isEditing && (
                            <form onSubmit={handleSubmitEdit}>
                                <input
                                    type="text"
                                    name="name"
                                    className="inputStyle"
                                    value={editFormData.name}
                                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                    placeholder="Nazwa"
                                />
                                <input
                                    className="inputStyle"
                                    type="number"
                                    name="kcal"
                                    value={editFormData.kcal}
                                    onChange={e => setEditFormData({
                                        ...editFormData,
                                        kcal: parseFloat(e.target.value)
                                    })}
                                    placeholder="Kalorie"
                                />
                                <input
                                    className="inputStyle"
                                    type="number"
                                    name="protein"
                                    value={editFormData.protein}
                                    onChange={e => setEditFormData({
                                        ...editFormData,
                                        protein: parseFloat(e.target.value)
                                    })}
                                    placeholder="Białko"
                                />
                                <input
                                    className="inputStyle"
                                    type="number"
                                    name="fat"
                                    value={editFormData.fat}
                                    onChange={e => setEditFormData({
                                        ...editFormData,
                                        fat: parseFloat(e.target.value)
                                    })}
                                    placeholder="Tłuszcze"
                                />
                                <input
                                    className="inputStyle"
                                    type="number"
                                    name="carbs"
                                    value={editFormData.carbs}
                                    onChange={e => setEditFormData({
                                        ...editFormData,
                                        carbs: parseFloat(e.target.value)
                                    })}
                                    placeholder="Węglowodany"
                                />
                                <input
                                    className="inputStyle"
                                    type="number"
                                    name="weight"
                                    value={editFormData.weight}
                                    onChange={e => setEditFormData({
                                        ...editFormData,
                                        weight: parseFloat(e.target.value)
                                    })}
                                    placeholder="Waga"
                                />
                                <div className="buttons-container">
                                    <button type="submit" className="btn">Zapisz zmiany</button>
                                    <button onClick={handleDelete} className="btn-delete">Usuń produkt</button>
                                    <button onClick={handleReturn} className="btn">Powrót</button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <p>Loading product details...</p>
                )}
            </div>
        </div>
    );
};


export default DetailsProductPage;
