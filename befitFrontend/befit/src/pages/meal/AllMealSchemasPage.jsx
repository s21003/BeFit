import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomLink } from "../../helpers/CustomLink";
import { BsFillTrashFill } from "react-icons/bs";
import NavBar from "../../components/NavBar";
import "../../styles/SchemaPage.css"

const AllMealSchemasPage = () => {
    const navigate = useNavigate();
    const [mealSchemas, setMealSchemas] = useState([]);
    const [mealSchemaProduct, setMealSchemaProduct] = useState([]);
    const [rows, setRows] = useState([]);

    const fetchMealSchemas = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/mealSchema/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setMealSchemas(await response.json());
        } catch (error) {
            console.error("Fetching mealSchemas failed: ", error);
        }
    };

    const fetchMealSchemaProduct = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/mealSchemaProduct/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setMealSchemaProduct(await response.json());
            console.log("setMealSchemaProduct: "+mealSchemaProduct)
        } catch (error) {
            console.error("Fetching mealSchemas failed: ", error);
        }
    };

    useEffect(() => {
        fetchMealSchemas();
        fetchMealSchemaProduct();
    }, []);

    useEffect(() => {
        const calculateNutritionData = async () => {
            const token = localStorage.getItem("token");
            let tempData = [];
            const nutritions = Array.from({ length: mealSchemas.length }, () => ({
                kcal: 0.0,
                protein: 0.0,
                fat: 0.0,
                carbs: 0.0,
            }));

            try {
                for (let i = 0; i < mealSchemaProduct.length; i++) {
                    const { weightsId, productId, mealSchemaId } = mealSchemaProduct[i];

                    const weightResponse = await fetch(`http://localhost:8080/weights/${weightsId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!weightResponse.ok) throw new Error(`HTTP error weight! Status: ${weightResponse.status}`);
                    const weight = await weightResponse.json();

                    const productResponse = await fetch(`http://localhost:8080/product/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!productResponse.ok) throw new Error(`HTTP error product! Status: ${productResponse.status}`);
                    const product = await productResponse.json();

                    const calculatedData = {
                        kcal: (product.kcal * weight.weight) / 100,
                        protein: (product.protein * weight.weight) / 100,
                        fat: (product.fat * weight.weight) / 100,
                        carbs: (product.carbs * weight.weight) / 100,
                        mealSchemaId,
                    };
                    tempData.push(calculatedData);
                    console.log("i: ",i,", calculatedData: ",calculatedData)
                }

                for (let i = 0; i < nutritions.length; i++) {
                    for (let j = 0; j < tempData.length; j++) {
                        if (mealSchemas[i]?.id === tempData[j].mealSchemaId) {
                            nutritions[i] = {
                                kcal: nutritions[i].kcal + (tempData[j]?.kcal || 0),
                                protein: nutritions[i].protein + (tempData[j]?.protein || 0),
                                fat: nutritions[i].fat + (tempData[j]?.fat || 0),
                                carbs: nutritions[i].carbs + (tempData[j]?.carbs || 0),
                            };
                        }
                    }
                }
                console.log("nutritions: ",nutritions)
                setRows(
                    mealSchemas.map((schema, i) => ({
                        id: schema.id,
                        name: schema.name,
                        kcal: Math.round(nutritions[i].kcal),
                        protein: Math.round(nutritions[i].protein),
                        fat: Math.round(nutritions[i].fat),
                        carbs: Math.round(nutritions[i].carbs),
                        creationDate: schema.creationDate,
                    }))
                );
            } catch (error) {
                console.error("Fetching or calculating data failed: ", error);
            }
        };

        if (mealSchemas.length && mealSchemaProduct.length) calculateNutritionData();
    }, [mealSchemas, mealSchemaProduct]);

    const handleRowClick = (mealSchemaId) => navigate(`/meal-schema/${mealSchemaId}`);

    const handleAddSchema = () => {
        navigate(`/add-meal-schema`);
    };

    const handleReturn = () => {
        navigate(`/all-meals`);
    };

    return (
        <div className="schemaPage-container">
            <NavBar />

            {mealSchemas.length > 0 ? (
                <div className="schemaPage">
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Kalorie</th>
                            <th>Białko</th>
                            <th>Tłuszcze</th>
                            <th>Węglowodany</th>
                            <th>Data utworzenia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} onClick={() => handleRowClick(row.id)}>
                                <td>{row.name}</td>
                                <td>{row.kcal}</td>
                                <td>{row.protein}</td>
                                <td>{row.fat}</td>
                                <td>{row.carbs}</td>
                                <td>{row.creationDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Brak dostępnych schematów posiłków.</p>
            )}
            <div className="button-container">
                <button type="submit" onClick={handleAddSchema}>Dodaj schemat</button>
                <button type="submit" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AllMealSchemasPage;
