import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/schema/SchemaPage.css"
import {jwtDecode} from "jwt-decode";

const AllMealSchemasPage = () => {
    const navigate = useNavigate();
    const [mealSchemas, setMealSchemas] = useState([]);
    const [mealSchemaProduct, setMealSchemaProduct] = useState([]);
    const [rows, setRows] = useState([]);

    const fetchMealSchemas = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);

        try {
            const response = await fetch(`http://localhost:8080/mealSchema/username/${decodedToken.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const userSchemas = await response.json();

            const userResponse = await fetch(`http://localhost:8080/user/${decodedToken.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!userResponse.ok) throw new Error(`HTTP error! Status: ${userResponse.status}`);
            const userData = await userResponse.json();

            const sharedResponse = await fetch(`http://localhost:8080/userTrainer/sharedMealSchemas/${userData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!sharedResponse.ok) throw new Error(`HTTP error! Status: ${sharedResponse.status}`);
            const sharedSchemas = await sharedResponse.json();

            console.log("sharedSchemas: ", sharedSchemas);

            setMealSchemas([...userSchemas,...sharedSchemas]);

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
            const decodedToken = jwtDecode(token);
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

                setRows(
                    mealSchemas.map((schema, i) => ({
                        id: schema.id,
                        name: schema.name,
                        kcal: Math.round(nutritions[i].kcal),
                        protein: Math.round(nutritions[i].protein),
                        fat: Math.round(nutritions[i].fat),
                        carbs: Math.round(nutritions[i].carbs),
                        creationDate: schema.creationDate,
                        creatorUsername: schema.creatorUsername === decodedToken.sub ? "Utworzone" : "Otrzymano od trenera"
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
            <h1>Twoje schematy posiłków</h1>
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
                            <th>Pochodzenie</th>
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
                                <td>{row.creatorUsername}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Brak dostępnych schematów posiłków.</p>
            )}
            <div className="schemaPage-button-container">
                <button className="schemaPage-add-btn" type="submit" onClick={handleAddSchema}>Dodaj schemat</button>
                <button className="schemaPage-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AllMealSchemasPage;
