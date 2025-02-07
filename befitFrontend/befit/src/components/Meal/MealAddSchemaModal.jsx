import React, { useEffect, useState } from "react";
import "../../styles/schema/SchemaModal.css";
import {jwtDecode} from "jwt-decode";

export const MealAddSchemaModal = ({ closeModal, onSubmit, mealId }) => {
    const [mealSchemas, setMealSchemas] = useState([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState(null);

    useEffect(() => {
        const fetchMealSchemas = async () => {
            try {
                const token = localStorage.getItem("token");
                const decodeToken = jwtDecode(token);

                const response = await fetch(`http://localhost:8080/mealSchema/username/${decodeToken.sub}`, {
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
                setMealSchemas(data);
            } catch (error) {
                console.error("Fetching meal schemas failed:", error);
            }
        };

        fetchMealSchemas();
    }, []);

    const handleSchemaChange = (e) => {
        setSelectedSchemaId(parseInt(e.target.value, 10));
    };

    const handleAddSchemaToMeal = async () => {
        if (!selectedSchemaId) {
            alert("Please select a schema!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const schemaProductsResponse = await fetch(
                `http://localhost:8080/mealSchemaProduct/mealSchema/${selectedSchemaId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!schemaProductsResponse.ok) {
                throw new Error("Failed to fetch schema products.");
            }
            const schemaProducts = await schemaProductsResponse.json();

            const newMealProducts = [];
            for (const schemaProduct of schemaProducts) {
                const { productId, weightsId } = schemaProduct;

                const weightResponse = await fetch(
                    `http://localhost:8080/weights/${weightsId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!weightResponse.ok) {
                    throw new Error("Failed to fetch weight.");
                }
                const weightData = await weightResponse.json();

                const newWeightResponse = await fetch(
                    `http://localhost:8080/weights/add`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ weight: weightData.weight }),
                    }
                );
                if (!newWeightResponse.ok) {
                    throw new Error("Failed to create new weight.");
                }
                const newWeight = await newWeightResponse.json();

                const newMealProductResponse = await fetch(
                    `http://localhost:8080/mealProduct/add`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            mealId,
                            productId,
                            weightsId: newWeight.id,
                        }),
                    }
                );
                if (!newMealProductResponse.ok) {
                    throw new Error("Failed to add product to meal.");
                }

                const newMealProduct = await newMealProductResponse.json();
                newMealProducts.push(newMealProduct);
            }
            onSubmit(newMealProducts);
            closeModal();
        } catch (error) {
            console.error("Error adding schema to meal:", error);
        }
    };

    return (
        <div
            className="schema-modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="schema-modal">
                <h3>Dodaj Schemat do Posiłku</h3>
                <div className="schema-modal-form-group">
                    <label htmlFor="mealSchema">Schemat:</label>
                    <select
                        id="mealSchema"
                        onChange={handleSchemaChange}
                        value={selectedSchemaId || ""}
                    >
                        <option value="" disabled>
                            Wybierz schemat
                        </option>
                        {mealSchemas.map((schema) => (
                            <option key={schema.id} value={schema.id}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schema-modal-buttons-container">
                    <button className="schema-modal-add-btn" onClick={handleAddSchemaToMeal}>
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
