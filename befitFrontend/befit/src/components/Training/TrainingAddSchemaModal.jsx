import React, { useState, useEffect } from "react";
import "../../styles/SchemaModal.css";

export const TrainingAddSchemaModal = ({ closeModal, onSubmit, trainingId }) => {
    const [trainingSchemas, setTrainingSchemas] = useState([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState(null);

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/trainingSchema/all`, {
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
                setTrainingSchemas(data);
            } catch (error) {
                console.error("Fetching training schemas failed:", error);
            }
        };

        fetchTrainingSchemas();
    }, []);

    const handleSchemaChange = (e) => {
        setSelectedSchemaId(parseInt(e.target.value, 10));
    };

    const handleAddSchemaToTraining = async () => {
        if (!selectedSchemaId) {
            alert("Please select a schema!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // Fetch exercises from the selected schema
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
            console.log("schemaExercises: ",schemaExercises);

            // Process each exercise: fetch its series, create new series, and add them to the training
            const newTrainingExercises = [];
            const existingSeries = {}; // To track already added series



            for (const schemaExercise of schemaExercises) {
                const { exerciseId, seriesId } = schemaExercise;

                // Skip the series if already processed
                if (existingSeries[seriesId]) continue;

                // Fetch existing series details
                const seriesResponse = await fetch(
                    `http://localhost:8080/series/${seriesId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!seriesResponse.ok) {
                    throw new Error("Failed to fetch series.");
                }
                const seriesData = await seriesResponse.json();
                console.log("seriesData: ", seriesData);

                // Create new series entry
                const newSeriesResponse = await fetch(
                    `http://localhost:8080/series/add`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            series: seriesData.series,
                            repeatNumber: seriesData.repeatNumber,
                            weight: seriesData.weight,
                        }),
                    }
                );
                if (!newSeriesResponse.ok) {
                    throw new Error("Failed to create new series.");
                }
                const newSeries = await newSeriesResponse.json();
                console.log("newSeries: ", newSeries);

                // Add the exercise to the training with the newly created series ID
                const newTrainingExerciseResponse = await fetch(
                    `http://localhost:8080/trainingExercise/add`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            trainingId,
                            exerciseId,
                            seriesId: newSeries.id,
                        }),
                    }
                );
                if (!newTrainingExerciseResponse.ok) {
                    throw new Error("Failed to add exercise to training.");
                }

                const newTrainingExercise = await newTrainingExerciseResponse.json();
                newTrainingExercises.push(newTrainingExercise);

                // Mark series as processed
                existingSeries[seriesId] = true;
            }

            console.log(newTrainingExercises);
            onSubmit(newTrainingExercises);
            closeModal();
        } catch (error) {
            console.error("Error adding schema to training:", error);
        }
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="modal">
                <h3>Add Schema to Training</h3>
                <div className="form-group">
                    <label htmlFor="trainingSchema">Schema:</label>
                    <select
                        id="trainingSchema"
                        onChange={handleSchemaChange}
                        value={selectedSchemaId || ""}
                    >
                        <option value="" disabled>
                            Select schema
                        </option>
                        {trainingSchemas.map((schema) => (
                            <option key={schema.id} value={schema.id}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn" onClick={handleAddSchemaToTraining}>
                    Dodaj schemat
                </button>
                <button className="btn" onClick={closeModal}>
                    Anuluj
                </button>
            </div>
        </div>
    );
};
