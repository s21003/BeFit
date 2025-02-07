import React, { useEffect, useState } from "react";
import "../../styles/schema/SchemaModal.css";

export const ShareMealSchemaModal = ({closeModal, onMealSchemaShared, mealSchemas, userTrainerId,}) => {
    const [selectedMealSchemaId, setSelectedMealSchemaId] = useState(null);
    const [sharedMealSchemas, setSharedMealSchemas] = useState();

    const handleSchemaChange = (e) => {
        setSelectedMealSchemaId(parseInt(e.target.value, 10));
    };

    useEffect(() => {
        const fetchSharedSchemas = async () => {
            try {
                const token = localStorage.getItem("token");
                const sharedResponse = await fetch(
                    `http://localhost:8080/userTrainer/${userTrainerId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!sharedResponse.ok) {
                    throw new Error(`HTTP error! status: ${sharedResponse.status}`);
                }
                const sharedData = await sharedResponse.json();
                setSharedMealSchemas(sharedData.sharedMealSchemas);
            } catch (error) {
                console.error("Error fetching shared schemas:", error);
            }
        };

        fetchSharedSchemas();
    }, [userTrainerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedMealSchemaId) {
            try {
                const token = localStorage.getItem("token");

                const existingSharedMealSchemas = sharedMealSchemas.map(
                    (schema) => schema.id
                );

                const updatedSharedMealSchemas = [...existingSharedMealSchemas];
                if (!existingSharedMealSchemas.includes(selectedMealSchemaId)) {
                    updatedSharedMealSchemas.push(selectedMealSchemaId);
                }
                console.log("updatedSharedMealSchemas: ",updatedSharedMealSchemas)

                const response = await fetch(
                    `http://localhost:8080/userTrainer/shareMealSchemas/${userTrainerId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedSharedMealSchemas),
                    }
                );

                if (response.ok) {
                    onMealSchemaShared([selectedMealSchemaId]);
                    closeModal();
                } else {
                    console.error("Error sharing meal schema:", response.status);
                }
            } catch (error) {
                console.error("Error sharing meal schema:", error);
            }
        } else {
            alert("Please select a schema to share!");
        }
    };

    const availableMealSchemas = sharedMealSchemas
        ? mealSchemas.filter(
            (schema) =>
                !sharedMealSchemas.some(
                    (sharedSchema) => sharedSchema.id === schema.id
                )
        )
        : mealSchemas;

    return (
        <div
            className="schema-modal-container"
            onClick={(e) => {
                if (e.target.className === "schema-modal-container") closeModal();
            }}
        >
            <div className="schema-modal">
                <h3>Udostępnij schemat posiłku</h3> {/* Changed title */}
                <div className="schema-modal-form-group">
                    <label htmlFor="mealSchema">Schemat:</label>
                    <select
                        id="mealSchema"
                        onChange={handleSchemaChange}
                        value={selectedMealSchemaId || ""}
                    >
                        <option value="" disabled>
                            Wybierz schemat
                        </option>
                        {availableMealSchemas.map((schema) => ( // Use filtered schemas
                            <option key={schema.id} value={schema.id}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schema-modal-buttons-container">
                    <button type="submit" className="schema-modal-save-btn"
                            onClick={handleSubmit}> {/* Use type="submit" */}
                        Udostępnij
                    </button>
                    <button type="button" className="schema-modal-cancel-btn" onClick={closeModal}>
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareMealSchemaModal;