import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllTrainersPage = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const trainersPerPage = 5;

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch(`http://localhost:8080/trainer/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainers(data);
            } catch (error) {
                console.error("Fetching trainers failed: ", error);
            }
        };
        fetchTrainers();
    }, []);

    const handleRowClick = (trainerId) => {
        navigate(`/trainer/${trainerId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(trainers.length / trainersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainers">All Trainers</Link>
                <Link to="/">Log out</Link>
            </nav>
            {trainers.length > 0 ? (
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
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Adres</th>
                            <th>Hasło</th>
                            <th>Specjalizacje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainers.map(trainer => (
                            <tr key={trainer.id} onClick={() => handleRowClick(trainer.id)}>
                                <td>{trainer.name}</td>
                                <td>{trainer.surname}</td>
                                <td>{trainer.address}</td>
                                <td>{trainer.password}</td>
                                <td>{trainer.specializations}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No trainers available.</p>
            )}
        </div>
    );
};

export default AllTrainersPage;