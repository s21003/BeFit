import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

const DetailsMealSchemaPage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [mealSchemaDetails, setMealSchemaDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        products: '',
        creatorId: '',
        creationDate: null,
    });

    useEffect(() => {
        const fetchMealSchemaDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/mealSchema/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMealSchemaDetails(data);
            } catch (error) {
                console.error("Fetching meal details failed: ", error);
                setMealSchemaDetails(null);
            }
        };
        fetchMealSchemaDetails();
    }, [id]);

    const handleEdit = () => {
        setEditFormData({
            products: mealSchemaDetails.products,
            creationDate: mealSchemaDetails.creationDate,
            creatorId: mealSchemaDetails.creatorId,
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const updatedData = { id: mealSchemaDetails.id, ...editFormData };

        try {
            const response = await fetch(`http://localhost:8080/mealSchema/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('MealSchema updated successfully');
                navigate("/all-meal-schemas")
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Updating mealSchema details failed: ", error);
        }
    };

    const handleDelete = async () => {
        const deletedData = { id: mealSchemaDetails.id, ...editFormData };
        if (window.confirm("Are you sure you want to delete this mealSchema?")) {
            try {
                const response = await fetch(`http://localhost:8080/mealSchema/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deletedData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Successfully deleted mealSchema");
                navigate('/all-meal-schemas')
            } catch (error) {
                console.error("Delete mealSchema failed: ", error);
            }
        }
    };

    return (
        <div className="mainPage">
            {user && <h1>Hello, {user.username}</h1>}
            <nav className="mainNavigation">
                <Link to="/all-meal-schemas">All MealSchema</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">MealSchema Details</h2>
                {mealSchemaDetails ? (
                    <>
                        <div className="detailsContent"><strong>Produkty:</strong> {mealSchemaDetails.products}</div>
                        <div className="detailsContent"><strong>Data utworzenia:</strong> {mealSchemaDetails.creationDate}</div>
                        <div className="detailsContent"><strong>Id twórcy:</strong> {mealSchemaDetails.creatorId}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete mealSchema</button>
                                <button onClick={handleEdit} className="submitButton">Edit mealSchema</button>
                                <form onSubmit={handleSubmitEdit}>
                                    <input
                                        type="text"
                                        name="products"
                                        className="inputStyle"
                                        value={editFormData.products}
                                        onChange={e => setEditFormData({...editFormData, products: e.target.value})}
                                        placeholder="Produkty"
                                    />
                                    <input
                                        type="date"
                                        name="creationDate"
                                        className="inputStyle"
                                        value={editFormData.creationDate || ""}
                                        onChange={e => setEditFormData({...editFormData, creationDate: e.target.value})}
                                        placeholder="DataUtworzenia"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="number"
                                        name="creatorId"
                                        value={editFormData.creatorId}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            creatorId: parseFloat(e.target.value)
                                        })}
                                        placeholder="IdTwórcy"
                                    />
                                    <button type="submit" className="submitButton">Update Meal Schema</button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <p>Loading Meal Schema details...</p>
                )}
            </div>
        </div>
    );
};

export default DetailsMealSchemaPage;
