import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllTrainingSchemasPage = () => {
    const navigate = useNavigate();
    const [trainingSchemas, setTrainingSchemas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const trainingSchemasPerPage = 5;

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            try {
                const response = await fetch(`http://localhost:8080/trainingSchema/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainingSchemas(data);
            } catch (error) {
                console.error("Fetching trainingSchemas failed: ", error);
            }
        };
        fetchTrainingSchemas();
    }, []);

    const handleRowClick = (trainingSchemaId) => {
        navigate(`/trainingSchema/${trainingSchemaId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(trainingSchemas.length / trainingSchemasPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainingSchemas">All Training schemats</Link>
                <Link to="/">Log out</Link>
            </nav>
            {trainingSchemas.length > 0 ? (
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
                            <th>Ćwiczenia</th>
                            <th>Data utworzenia</th>
                            <th>Id twórcy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainingSchemas.map(trainingSchema => (
                            <tr key={trainingSchema.id} onClick={() => handleRowClick(trainingSchema.id)}>
                                <td>{trainingSchema.exercises}</td>
                                <td>{trainingSchema.creationDate}</td>
                                <td>{trainingSchema.creatorId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No trainingSchemas available.</p>
            )}
        </div>
    );
};

export default AllTrainingSchemasPage;