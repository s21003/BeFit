import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

const DetailsMealPage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [mealDetails, setMealDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        meal: '',
        idUser: '',
        date: null,
    });

    useEffect(() => {
        const fetchMealDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/meal/${id}`);
                if (!response.ok) {
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
            meal: mealDetails.meal,
            idUser: mealDetails.idUser,
            date: mealDetails.date,
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
                <Link to="/all-mealts">All Meals</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">Meal Details</h2>
                {mealDetails ? (
                    <>
                        <div className="detailsContent"><strong>Posiłek:</strong> {mealDetails.meal}</div>
                        <div className="detailsContent"><strong>Data dodania:</strong> {mealDetails.date}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete meal</button>
                                <button onClick={handleEdit} className="submitButton">Edit meal</button>
                                <form onSubmit={handleSubmitEdit}>
                                    <input
                                        type="text"
                                        name="meal"
                                        className="inputStyle"
                                        value={editFormData.meal}
                                        onChange={e => setEditFormData({...editFormData, meal: e.target.value})}
                                        placeholder="Posiłek"
                                    />
                                    <input
                                        type="date"
                                        name="date"
                                        className="inputStyle"
                                        value={editFormData.date || ""}
                                        onChange={e => setEditFormData({...editFormData, date: e.target.value})}
                                        placeholder="DataDodania"
                                    />
                                    <button type="submit" className="submitButton">Update meal</button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <p>Loading meal details...</p>
                )}
            </div>
        </div>
    );
};

export default DetailsMealPage;
