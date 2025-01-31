import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

const StudentsGoalPage = () => {
    const { studentUserName } = useParams(); // Get student username from URL
    const navigate = useNavigate(); // Navigation hook for the Return button
    const [goal, setGoal] = useState({
        id: 0.0,
        actualWeight: 0.0,
        plannedDailyKcal: 0.0,
        plannedDailyProteins: 0.0,
        plannedDailyFats: 0.0,
        plannedDailyCarbs: 0.0,
        targetWeight: 0.0,
        plannedAccomplishDate: null,
        recommendedDailyKcal: 0.0,
        recommendedDailyProteins: 0.0,
        recommendedDailyFats: 0.0,
        recommendedDailyCarbs: 0.0,
    });

    useEffect(() => {
        fetchStudentGoal();
    }, [studentUserName]);

    const fetchStudentGoal = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found, please login again.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/goal/user/${studentUserName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Student Goal data:", data);
            setGoal(data);
        } catch (error) {
            console.error("Fetching student's goal failed:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGoal((prevState) => ({
            ...prevState,
            [name]: parseFloat(value), // Update the corresponding field in state
        }));
    };

    const saveChanges = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found, please login again.");
            return;
        }

        const goalPayLoad = {
            id: goal.id,
            recommendedDailyKcal: goal.recommendedDailyKcal,
            recommendedDailyProteins: goal.recommendedDailyProteins,
            recommendedDailyFats: goal.recommendedDailyFats,
            recommendedDailyCarbs: goal.recommendedDailyCarbs,
            actualWeight: goal.actualWeight,
            plannedDailyKcal: goal.plannedDailyKcal,
            plannedDailyProteins: goal.plannedDailyProteins,
            plannedDailyFats: goal.plannedDailyFats,
            plannedDailyCarbs: goal.plannedDailyCarbs,
            targetWeight: goal.targetWeight,
            plannedAccomplishDate: goal.plannedAccomplishDate,
        }

        console.log("goalPayLoad", goalPayLoad);
        try {
            const response = await fetch(`http://localhost:8080/goal/update/trainer/${goal.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(goalPayLoad),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log("Update result:", result);
            alert("Goal updated successfully!");
        } catch (error) {
            console.error("Updating goal failed:", error);
        }
    };

    if (!goal) {
        return <div>Loading...</div>;
    }

    const handleReturn = () => {
        navigate(`/details-student/${studentUserName}`);  // Use the username from the state
    };

    return (
        <div className="goalsTab">
            <NavBar />
            <h2>Cele podopiecznego</h2>
            <div className="goalForm">
                <div className="formRow">
                    {/* Planned Fields */}
                    <div className="plannedFields">
                        <label>Aktualna waga</label>
                        <input
                            type="number"
                            value={goal.actualWeight || ""}
                            readOnly
                            className="subtleReadOnly"
                        />

                        <label>Planowane dzienne kalorie</label>
                        <input
                            type="number"
                            value={goal.plannedDailyKcal || ""}
                            readOnly
                            className="subtleReadOnly"
                        />

                        <label>Planowane dzienne białko</label>
                        <input
                            type="number"
                            value={goal.plannedDailyProteins || ""}
                            readOnly
                            className="subtleReadOnly"
                        />

                        <label>Planowane dzienne tłuszcze</label>
                        <input
                            type="number"
                            value={goal.plannedDailyFats || ""}
                            readOnly
                            className="subtleReadOnly"
                        />

                        <label>Planowane dzienne węglowodany</label>
                        <input
                            type="number"
                            value={goal.plannedDailyCarbs || ""}
                            readOnly
                            className="subtleReadOnly"
                        />
                    </div>

                    {/* Recommended Fields */}
                    <div className="recommendedFields">
                        <label>Docelowa waga</label>
                        <input
                            type="number"
                            value={goal.targetWeight || ""}
                            readOnly
                            className="subtleReadOnly"
                        />

                        <label>Rekomendowane dzienne kalorie</label>
                        <input
                            type="number"
                            value={goal.recommendedDailyKcal || ""}
                            name="recommendedDailyKcal"
                            onChange={handleInputChange}
                            placeholder={goal.recommendedDailyKcal || "Enter kcal"}
                        />

                        <label>Rekomendowane dzienne białko</label>
                        <input
                            type="number"
                            value={goal.recommendedDailyProteins || ""}
                            name="recommendedDailyProteins"
                            onChange={handleInputChange}
                            placeholder={goal.recommendedDailyProteins || "Enter proteins"}
                        />

                        <label>RRekomendowane dzienne tłuszcze</label>
                        <input
                            type="number"
                            value={goal.recommendedDailyFats || ""}
                            name="recommendedDailyFats"
                            onChange={handleInputChange}
                            placeholder={goal.recommendedDailyFats || "Enter fats"}
                        />

                        <label>Rekomendowane dzienne węglowodany</label>
                        <input
                            type="number"
                            value={goal.recommendedDailyCarbs || ""}
                            name="recommendedDailyCarbs"
                            onChange={handleInputChange}
                            placeholder={goal.recommendedDailyCarbs || "Enter carbs"}
                        />
                    </div>

                </div>

                {/* Planned Accomplish Date */}
                <div className="dateField">
                    <label>Planowana data osiągnięcia celu</label>
                    <input
                        type="date"
                        value={goal.plannedAccomplishDate || ""}
                        readOnly
                        className="subtleReadOnly"
                    />
                </div>

                {/* Save Button */}
                <button className="saveButton" onClick={saveChanges}>
                    Zapisz
                </button>
                <button onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default StudentsGoalPage;
