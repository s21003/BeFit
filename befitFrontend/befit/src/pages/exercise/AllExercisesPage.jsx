import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {CustomLink} from "../../helpers/CustomLink";

const AllExercisesPage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const exercisesPerPage = 5;

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/exercise/all`, {
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
            <CustomLink to={"/add-exercise"}>Add Exercise</CustomLink>
            {exercises.length > 0 ? (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Partia</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exercises.map(exercise => (
                            <tr key={exercise.id} onClick={() => handleRowClick(exercise.id)}>
                                <td>{exercise.name}</td>
                                <td>{exercise.part}</td>
                                <td>{exercise.videoLink}</td>
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
                <p>No exercises available.</p>
            )}
        </div>
    );
};

export default AllExercisesPage;