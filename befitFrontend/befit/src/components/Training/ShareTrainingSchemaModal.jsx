import {useEffect, useState} from "react";
import "../../styles/schema/SchemaModal.css";

export const ShareTrainingSchemaModal = ({closeModal, onTrainingSchemaShared, trainingSchemas, userTrainerId,}) => {
    const [selectedTrainingSchemaId, setSelectedTrainingSchemaId] = useState(null);
    const [sharedTrainingSchemas, setSharedTrainingSchemas] = useState([]);


    const handleSchemaChange = (e) => {
        setSelectedTrainingSchemaId(parseInt(e.target.value, 10));
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
                setSharedTrainingSchemas(sharedData.sharedTrainingSchemas);
            } catch (error) {
                console.error("Error fetching shared schemas:", error);
            }
        };

        fetchSharedSchemas();
    }, [userTrainerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTrainingSchemaId) {
            try {
                const token = localStorage.getItem("token");

                const existingSharedTrainingSchemas = sharedTrainingSchemas.map(
                    (schema) => schema.id
                );

                const updatedSharedTrainingSchemas = [...existingSharedTrainingSchemas];
                if (!existingSharedTrainingSchemas.includes(selectedTrainingSchemaId)) {
                    updatedSharedTrainingSchemas.push(selectedTrainingSchemaId);
                }
                console.log("updatedSharedMealSchemas: ",updatedSharedTrainingSchemas)

                const response = await fetch(
                    `http://localhost:8080/userTrainer/shareMealSchemas/${userTrainerId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedSharedTrainingSchemas),
                    }
                );

                if (response.ok) {
                    onTrainingSchemaShared([selectedTrainingSchemaId]);
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

    const availableTrainingSchemas = sharedTrainingSchemas
        ? trainingSchemas.filter(
            (schema) =>
                !sharedTrainingSchemas.some(
                    (sharedSchema) => sharedSchema.id === schema.id
                )
        )
        : trainingSchemas;

    return (
        <div
            className="schema-modal-container"
            onClick={(e) => {
                if (e.target.className === "schema-modal-container")
                    closeModal();
            }}
        >
            <div className="schema-modal">
                <h3>Udostępnij schemat treningu</h3>
                <div className="schema-modal-form-group">
                    <label htmlFor="trainingSchema">Schemat:</label>
                    <select
                        id="trainingSchema"
                        onChange={handleSchemaChange}
                        value={selectedTrainingSchemaId || ""}
                    >
                        <option value="" disabled>
                            Wybierz schemat
                        </option>
                        {availableTrainingSchemas.map((schema) => (
                            <option key={schema.id} value={schema.id}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schema-modal-buttons-container">
                    <button type="submit" className="schema-modal-save-btn" onClick={handleSubmit}>
                        Udostępnij
                    </button>
                    <button
                        type="button"
                        className="schema-modal-cancel-btn"
                        onClick={closeModal}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareTrainingSchemaModal;