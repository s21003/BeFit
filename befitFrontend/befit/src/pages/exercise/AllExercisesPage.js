import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllExercisesPage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const exercisesPerPage = 5;

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(`http://localhost:8080/exercise/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExercises(data);
            } catch (error) {
                console.error("Fetching exercises failed: ", error);
            }
        };
        fetchExercises();
    }, []);

    const handleRowClick = (exerciseId) => {
        navigate(`/exercise/${exerciseId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(exercises.length / exercisesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-exercises">All Exercises</Link>
                <Link to="/">Log out</Link>
            </nav>
            {exercises.length > 0 ? (
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
                            <th>Partia</th>
                            <th>Link</th>
                            <th>Serie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exercises.map(exercise => (
                            <tr key={exercise.id} onClick={() => handleRowClick(exercise.id)}>
                                <td>{exercise.name}</td>
                                <td>{exercise.part}</td>
                                <td>{exercise.videoLink}</td>
                                <td>{exercise.series}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No exercises available.</p>
            )}
        </div>
    );
};

export default AllExercisesPage;