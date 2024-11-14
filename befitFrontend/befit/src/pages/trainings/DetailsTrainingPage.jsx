import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {CustomLink} from "../../helpers/CustomLink";

const DetailsTrainingPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const trainingPerPage = 5;

    useEffect(() => {
        const fetchTraining = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/training/${id}`,{
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
                setTraining(data);
            } catch (error) {
                console.error("Fetching training failed: ", error);
            }
        };
        fetchTraining();
    }, []);

    const handleRowClick = (trainingId) => {
        navigate(`/training/${trainingId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(training.length / trainingPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-trainings">All Trainings</Link>
                <Link to="/">Log out</Link>
            </nav>
            {training.length > 0 ? (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Exercise's name</th>
                            <th>Body part</th>
                            <th>Planned number of series</th>
                            <th>Planned number of repetitions in a series</th>
                            <th>Planned weight in a series</th>
                        </tr>
                        </thead>
                        <tbody>
                        {training.map(training => (
                            <tr key={training.id} onClick={() => handleRowClick(training.id)}>
                                <td>{training.exercises.name}</td>
                                <td>{training.exercises.part}</td>
                                <td>{training.exercises.series.series}</td>
                                <td>{training.exercises.series.repeatNumber}</td>
                                <td>{training.exercises.series.weight}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                </>
            ) : (
                <p>Training not found.</p>
            )}
        </div>
    );
};

export default DetailsTrainingPage;