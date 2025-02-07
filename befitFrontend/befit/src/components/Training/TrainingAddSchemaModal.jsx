import React, { useEffect, useState } from "react";
import "../../styles/schema/SchemaModal.css";
import { jwtDecode } from "jwt-decode";

export const TrainingAddSchemaModal = ({ closeModal, onSubmit, trainingId }) => {
    const [trainingSchemas, setTrainingSchemas] = useState([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState(null);

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            try {
                const token = localStorage.getItem("token");
                const decodeToken = jwtDecode(token);

                const response = await fetch(`http://localhost:8080/trainingSchema/username/${decodeToken.sub}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainingSchemas(data);
            } catch (error) {
                console.error("Fetching training schemas failed:", error);
            }
        };

        fetchTrainingSchemas();
    },);

    const handleSchemaChange = (e) => {
        setSelectedSchemaId(parseInt(e.target.value, 10));
    };

    const handleAddSchemaToTraining = async () => {
        if (!selectedSchemaId) {
            alert("Proszę wybrać schemat!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const schemaExercisesResponse = await fetch(
                `http://localhost:8080/trainingSchemaExercise/trainingSchema/${selectedSchemaId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!schemaExercisesResponse.ok) {
                throw new Error("Failed to fetch schema exercises.");
            }
            const schemaExercises = await schemaExercisesResponse.json();

            const newTrainingExercises = [];
            for (const schemaExercise of schemaExercises) {
                const { exerciseId, seriesId } = schemaExercise;

                const seriesResponse = await fetch(
                    `http://localhost:8080/series/${seriesId}`,{
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (!seriesResponse.ok) {
                    throw new Error("Failed to fetch series.");
                }
                const seriesData = await seriesResponse.json();

                const newSeriesResponse = await fetch(
                    `http://localhost:8080/series/add`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            series: seriesData.series,
                            repeatNumber: seriesData.repeatNumber,
                            weight: seriesData.weight
                        }),
                    }
                );
                if (!newSeriesResponse.ok) {
                    throw new Error("Failed to add series.");
                }
                const newSeries = await newSeriesResponse.json();

                const newTrainingExerciseResponse = await fetch(
                    `http://localhost:8080/trainingExercise/add`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type':'application/json',
                        },
                        body: JSON.stringify({
                            trainingId,
                            exerciseId,
                            seriesId: newSeries.id
                        }),
                    }
                );
                if (!newTrainingExerciseResponse.ok) {
                    throw new Error("Failed to add exercise to training.");
                }

                const newTrainingExercise = await newTrainingExerciseResponse.json();
                newTrainingExercises.push(newTrainingExercise);
            }
            onSubmit(newTrainingExercises);
            closeModal();

        } catch (error) {
            console.error("Error adding schema to training:", error);
        }
    };

    return (
        <div
            className="schema-modal-container"
            onClick={(e) => {
                if (e.target.className === "schema-modal-container")
                    closeModal();
            }}
        >
            <div className="schema-modal">
                <h3>Dodaj Schemat do Treningu</h3>
                <div className="schema-modal-form-group">
                    <label htmlFor="trainingSchema">Schemat:</label>
                    <select
                        id="trainingSchema"
                        onChange={handleSchemaChange}
                        value={selectedSchemaId || ""}
                    >
                        <option value="" disabled>
                            Wybierz schemat
                        </option>
                        {trainingSchemas.map((schema) => (
                            <option key={schema.id} value={schema.id}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schema-modal-buttons-container">
                    <button className="schema-modal-add-btn" onClick={handleAddSchemaToTraining}>
                        Dodaj schemat
                    </button>
                    <button className="schema-modal-cancel-btn" onClick={closeModal}>
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
};