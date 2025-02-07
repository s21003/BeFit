import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../styles/profile/GoalComponent.css"

const GoalComponent = () => {
    const [goal, setGoal] = useState({
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
    const [activeTab, setActiveTab] = useState("planned");
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchGoal();
        setUserRole();
    }, []);

    const fetchGoal = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        try {
            const response = await fetch(`http://localhost:8080/goal/user/${username}`, {
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
            setGoal(data);
        } catch (error) {
            console.error("Fetching goal failed: ", error);
        }
    };

    const setUserRole = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userRole = decodedToken.ROLE[0].authority;
                setRole(userRole);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    };

    const handleGoalChange = (field, value) => {
        setGoal((prevGoal) => ({
            ...prevGoal,
            [field]: value,
        }));
    };

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/goal/update/${goal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(goal),
            });

            if (!response.ok) {
                throw new Error("Failed to update goal");
            }

            alert("Goal updated successfully!");
            fetchGoal();
        } catch (error) {
            console.error("Saving goal failed:", error);
        }
    };

    const handleSetAsPlanned = () => {
        setGoal((prevGoal) => ({
            ...prevGoal,
            plannedDailyKcal: prevGoal.recommendedDailyKcal,
            plannedDailyProteins: prevGoal.recommendedDailyProteins,
            plannedDailyFats: prevGoal.recommendedDailyFats,
            plannedDailyCarbs: prevGoal.recommendedDailyCarbs,
        }));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (!goal) {
        return <div>Loading...</div>;
    }

    return (
        <div className="goalsTab">
            <h2>Cele</h2>
            <form className="goalForm" onSubmit={handleSaveGoal}>
                <div className="goalFormRow">
                    <div className="goalForm-plannedFields">
                        <label>Aktualna waga</label>
                        <input
                            type="number"
                            value={goal.actualWeight || ""}
                            onChange={(e) =>
                                handleGoalChange("actualWeight", parseFloat(e.target.value))
                            }
                        />
                        <label>Planowane dzienne kalorie</label>
                        <input
                            type="number"
                            value={goal.plannedDailyKcal || ""}
                            onChange={(e) =>
                                handleGoalChange("plannedDailyKcal", parseFloat(e.target.value))
                            }
                        />
                        <label>Planowane dzienne białko</label>
                        <input
                            type="number"
                            value={goal.plannedDailyProteins || ""}
                            onChange={(e) =>
                                handleGoalChange("plannedDailyProteins", parseFloat(e.target.value))
                            }
                        />
                        <label>Planowane dzienne tłuszcze</label>
                        <input
                            type="number"
                            value={goal.plannedDailyFats || ""}
                            onChange={(e) =>
                                handleGoalChange("plannedDailyFats", parseFloat(e.target.value))
                            }
                        />
                        <label>Planowane dzienne węglowodany</label>
                        <input
                            type="number"
                            value={goal.plannedDailyCarbs || ""}
                            onChange={(e) =>
                                handleGoalChange("plannedDailyCarbs", parseFloat(e.target.value))
                            }
                        />
                        <label>Docelowa waga</label>
                        <input
                            type="number"
                            value={goal.targetWeight || ""}
                            onChange={(e) =>
                                handleGoalChange("targetWeight", parseFloat(e.target.value))
                            }
                        />
                    </div>

                    <div className="goalForm-recommendedFields">
                        {role !== "TRAINER" && (
                            <>
                                <div className="recommendedLabel">
                                    <label>Rekomendowane przez:</label>
                                </div>
                                <div className="goalForm-tabs">
                                    <button
                                        type="button"
                                        className={`goalTab ${activeTab === "planned" ? "active" : ""}`}
                                        onClick={() => handleTabChange("planned")}
                                    >
                                        Befit
                                    </button>
                                    <button
                                        type="button"
                                        className={`goalTab ${activeTab === "trainer" ? "active" : ""}`}
                                        onClick={() => handleTabChange("trainer")}
                                    >
                                        Trenera
                                    </button>
                                </div>

                                {activeTab === "planned" && (
                                    <>
                                        <label>Rekomendowane dzienne kalorie</label>
                                        <input
                                            type="number"
                                            value={goal.plannedDailyKcal || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne białko</label>
                                        <input
                                            type="number"
                                            value={goal.plannedDailyProteins || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne tłuszcze</label>
                                        <input
                                            type="number"
                                            value={goal.plannedDailyFats || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne węglowodany</label>
                                        <input
                                            type="number"
                                            value={goal.plannedDailyCarbs || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                    </>
                                )}

                                {activeTab === "trainer" && (
                                    <>
                                        <label>Rekomendowane dzienne kalorie</label>
                                        <input
                                            type="number"
                                            value={goal.recommendedDailyKcal || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne białko</label>
                                        <input
                                            type="number"
                                            value={goal.recommendedDailyProteins || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne tłuszcze</label>
                                        <input
                                            type="number"
                                            value={goal.recommendedDailyFats || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                        <label>Rekomendowane dzienne węglowodany</label>
                                        <input
                                            type="number"
                                            value={goal.recommendedDailyCarbs || ""}
                                            readOnly
                                            className="readonlyInput"
                                        />
                                    </>
                                )}

                                <div className="setAsPlannedButton-buttons-container">
                                    <button type="button" className="setAsPlannedButton" onClick={handleSetAsPlanned}>Ustaw jako planowane</button>
                                </div>
                            </>
                        )}

                        {/* If user is a TRAINER, show only the read-only fields without tabs */}
                        {role === "TRAINER" && (
                            <>
                                <div className="goalForm-recommendedLabel">
                                <label>Rekomendowane przez Befit:</label>
                                </div>
                                <label>Rekomendowane dzienne kalorie</label>
                                <input
                                    type="number"
                                    value={goal.recommendedDailyKcal || ""}
                                    readOnly
                                    className="readonlyInput"
                                />
                                <label>Rekomendowane dzienne białko</label>
                                <input
                                    type="number"
                                    value={goal.recommendedDailyProteins || ""}
                                    readOnly
                                    className="readonlyInput"
                                />
                                <label>Rekomendowane dzienne tłuszcze</label>
                                <input
                                    type="number"
                                    value={goal.recommendedDailyFats || ""}
                                    readOnly
                                    className="readonlyInput"
                                />
                                <label>Rekomendowane dzienne węglowodany</label>
                                <input
                                    type="number"
                                    value={goal.recommendedDailyCarbs || ""}
                                    readOnly
                                    className="readonlyInput"
                                />

                                <button
                                    type="button"
                                    className="setAsPlannedButton"
                                    onClick={handleSetAsPlanned}
                                >
                                    Ustaw jako planowane
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Planned Accomplish Date */}
                <div className="goalForm-dateField">
                    <label>Planowana data realizacji</label>
                    <input
                        type="date"
                        value={goal.plannedAccomplishDate || ""}
                        onChange={(e) =>
                            handleGoalChange("plannedAccomplishDate", e.target.value)
                        }
                    />
                </div>

                <button type="submit" className="saveGoalButton">
                    Zapisz cele
                </button>
            </form>
        </div>
    );
};

export default GoalComponent;
