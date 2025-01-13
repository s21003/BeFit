import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

const DetailsMealPage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [mealDetails, setMealDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        products: '',
        creatorId: '',
        creationDate: null,
    });

    useEffect(() => {
        const fetchMealDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/meal/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMealDetails(data);
            } catch (error) {
                console.error("Fetching meal details failed: ", error);
                setMealDetails(null);
            }
        };
        fetchMealDetails();
    }, [id]);

    const handleEdit = () => {
        setEditFormData({
            products: mealDetails.products,
            creationDate: mealDetails.creationDate,
            creatorId: mealDetails.creatorId,
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const updatedData = { id: mealDetails.id, ...editFormData };

        try {
            const response = await fetch(`http://localhost:8080/meal/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Meal updated successfully');
                navigate("/all-meals")
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Updating meal details failed: ", error);
        }
    };

    const handleDelete = async () => {
        const deletedData = { id: mealDetails.id, ...editFormData };
        if (window.confirm("Are you sure you want to delete this meal?")) {
            try {
                const response = await fetch(`http://localhost:8080/meal/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deletedData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Successfully deleted meal");
                navigate('/all-meals')
            } catch (error) {
                console.error("Delete meal failed: ", error);
            }
        }
    };

    return (
        <div className="mainPage">
            {user && <h1>Hello, {user.username}</h1>}
            <nav className="mainNavigation">
                <Link to="/all-meals">All Meal</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">Meal Details</h2>
                {mealDetails ? (
                    <>
                        <div className="detailsContent"><strong>Produkty:</strong> {mealDetails.products}</div>
                        <div className="detailsContent"><strong>Data utworzenia:</strong> {mealDetails.creationDate}</div>
                        <div className="detailsContent"><strong>Id twórcy:</strong> {mealDetails.creatorId}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete meal</button>
                                <button onClick={handleEdit} className="submitButton">Edit meal</button>
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
                                    <button type="submit" className="submitButton">Update Meal </button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <p>Loading Meal  details...</p>
                )}
            </div>
        </div>
    );
};

export default DetailsMealPage;
