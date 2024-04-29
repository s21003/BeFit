import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllMealSchemasPage = () => {
    const navigate = useNavigate();
    const [mealSchemas, setMealSchemas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const mealSchemasPerPage = 5;

    useEffect(() => {
        const fetchMealSchemas = async () => {
            try {
                const response = await fetch(`http://localhost:8080/mealSchema/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMealSchemas(data);
            } catch (error) {
                console.error("Fetching mealSchemas failed: ", error);
            }
        };
        fetchMealSchemas();
    }, []);

    const handleRowClick = (mealSchemaId) => {
        navigate(`/meal-schema/${mealSchemaId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(mealSchemas.length / mealSchemasPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-mealSchemas">All Meal schemats</Link>
                <Link to="/">Log out</Link>
            </nav>
            {mealSchemas.length > 0 ? (
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
                            <th>Produkty</th>
                            <th>Data dodania</th>
                            <th>Id twórcy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mealSchemas.map(mealSchema => (
                            <tr key={mealSchema.id} onClick={() => handleRowClick(mealSchema.id)}>
                                <td>{mealSchema.products}</td>
                                <td>{mealSchema.creationDate}</td>
                                <td>{mealSchema.creatorId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No mealSchemas available.</p>
            )}
        </div>
    );
};

export default AllMealSchemasPage;