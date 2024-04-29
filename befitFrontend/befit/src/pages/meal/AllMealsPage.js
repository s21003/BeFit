import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllMealsPage = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const mealsPerPage = 5;

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch(`http://localhost:8080/meal/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMeals(data);
            } catch (error) {
                console.error("Fetching meals failed: ", error);
            }
        };
        fetchMeals();
    }, []);

    const handleRowClick = (mealId) => {
        navigate(`/meal/${mealId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(meals.length / mealsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-meal-schemas">All Meals</Link>
                <Link to="/">Log out</Link>
            </nav>
            {meals.length > 0 ? (
                <>
                    <nav>
                        <ul className="pagination">
                            {pageNumbers.map(number => (
                                <li key={number} className="page-item">
                                    <button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <table>
                        <thead>
                        <tr>
                            <th>posiłek</th>
                            <th>id użytkownika</th>
                            <th>data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {meals.map(meal => (
                            <tr key={meal.id} onClick={() => handleRowClick(meal.id)}>
                                <td>{meal.meal}</td>
                                <td>{meal.idUser}</td>
                                <td>{meal.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No meals available.</p>
            )}
        </div>
    );
};

export default AllMealsPage;