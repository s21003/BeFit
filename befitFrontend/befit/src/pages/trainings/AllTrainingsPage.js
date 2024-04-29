import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllTrainingsPage = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const trainingsPerPage = 5;

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(`http://localhost:8080/training/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainings(data);
            } catch (error) {
                console.error("Fetching trainings failed: ", error);
            }
        };
        fetchTrainings();
    }, []);

    const handleRowClick = (trainingId) => {
        navigate(`/training/${trainingId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(trainings.length / trainingsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainings">All Trainings</Link>
                <Link to="/">Log out</Link>
            </nav>
            {trainings.length > 0 ? (
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
                            <th>Nazwa</th>
                            <th>Kalorie</th>
                            <th>Białko</th>
                            <th>Tłuszcze</th>
                            <th>Węglowodany</th>
                            <th>Waga</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainings.map(training => (
                            <tr key={training.id} onClick={() => handleRowClick(training.id)}>
                                <td>{training.name}</td>
                                <td>{training.kcal}</td>
                                <td>{training.protein}</td>
                                <td>{training.fat}</td>
                                <td>{training.carbs}</td>
                                <td>{training.weight}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No trainings available.</p>
            )}
        </div>
    );
};

export default AllTrainingsPage;