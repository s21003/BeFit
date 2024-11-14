import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllGoalsPage = () => {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const goalsPerPage = 5;

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch(`http://localhost:8080/goal/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGoals(data);
            } catch (error) {
                console.error("Fetching goals failed: ", error);
            }
        };
        fetchGoals();
    }, []);

    const handleRowClick = (goalId) => {
        navigate(`/goal/${goalId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(goals.length / goalsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/goals">All Goals</Link>
                <Link to="/">Log out</Link>
            </nav>
            {goals.length > 0 ? (
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
                            <th>Aktualna waga</th>
                            <th>Planowana ilość kalorii</th>
                            <th>Planowana ilość białka</th>
                            <th>Planowana ilość tłuszczy</th>
                            <th>Planowana ilość węglowodanów</th>
                            <th>Planowana data celu</th>
                            <th>Zalecana ilość kalorii</th>
                            <th>Zalecana ilość białka</th>
                            <th>Zalecana ilość tłuszczy</th>
                            <th>Zalecana ilość węglowodanów</th>
                            <th>docelowa waga</th>
                        </tr>
                        </thead>
                        <tbody>
                        {goals.map(goal => (
                            <tr key={goal.id} onClick={() => handleRowClick(goal.id)}>
                                <td>{goal.actualWeight}</td>
                                <td>{goal.plannedDailyKcal}</td>
                                <td>{goal.plannedDailyProteins}</td>
                                <td>{goal.plannedDailyFats}</td>
                                <td>{goal.plannedDailyCarbs}</td>
                                <td>{goal.plannedAccomplishDate}</td>
                                <td>{goal.recommendedDailyKcal}</td>
                                <td>{goal.recommendedDailyProteins}</td>
                                <td>{goal.recommendedDailyFats}</td>
                                <td>{goal.recommendedDailyCarbs}</td>
                                <td>{goal.targetWeight}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No goals available.</p>
            )}
        </div>
    );
};

export default AllGoalsPage;