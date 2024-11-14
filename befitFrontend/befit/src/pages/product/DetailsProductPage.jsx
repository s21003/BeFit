import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

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

    useEffect(() => {
        const fetchProductDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/product/${id}`,{
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
                setProductDetails(null); // Handle error by setting productDetails to null
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleEdit = () => {
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
                navigate("/all-products")
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
                navigate('/all-products')
            } catch (error) {
                console.error("Delete product failed: ", error);
            }
        }
    };

    return (
        <div className="mainPage">
            {user && <h1>Hello, {user.username}</h1>}
            <nav className="mainNavigation">
                <Link to="/all-products">All Products</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">Product Details</h2>
                {productDetails ? (
                    <>
                        <div className="detailsContent"><strong>Nazwa:</strong> {productDetails.name}</div>
                        <div className="detailsContent"><strong>Kalorie:</strong> {productDetails.kcal}</div>
                        <div className="detailsContent"><strong>Białko:</strong> {productDetails.protein}</div>
                        <div className="detailsContent"><strong>Tłuszcze:</strong> {productDetails.fat}</div>
                        <div className="detailsContent"><strong>Węglowodany:</strong> {productDetails.carbs}</div>
                        <div className="detailsContent"><strong>Waga:</strong> {productDetails.weight}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete product</button>
                                <button onClick={handleEdit} className="submitButton">Edit product</button>
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
                                    <button type="submit" className="submitButton">Update Product</button>
                                </form>
                            </>
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
