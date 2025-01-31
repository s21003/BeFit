import React, { useEffect, useState } from "react";
import "../../styles/SchemaModal.css";

export const MealAddSchemaModal = ({ closeModal, onSubmit, mealId }) => {
    const [mealSchemas, setMealSchemas] = useState([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState(null);

    useEffect(() => {
        const fetchMealSchemas = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/mealSchema/all`, {
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

            // Fetch products from the selected schema
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
            console.log(schemaProducts);

            // Process each product: fetch its weight, create a new weight, and add it to the meal
            const newMealProducts = [];
            for (const schemaProduct of schemaProducts) {
                const { productId, weightsId } = schemaProduct;

                // Fetch existing weight
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
                console.log("weightData: ",weightData);

                // Create new weight
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
                console.log("newWeight: ",newWeight);

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
            console.log(newMealProducts);
            onSubmit(newMealProducts);
            closeModal();
        } catch (error) {
            console.error("Error adding schema to meal:", error);
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
                <h3>Dodaj Schemat do Posiłku</h3>
                <div className="form-group">
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
                <button className="btn" onClick={handleAddSchemaToMeal}>
                    Dodaj schemat
                </button>
                <button className="btn" onClick={closeModal}>
                    Anuluj
                </button>
            </div>
        </div>
    );
};
