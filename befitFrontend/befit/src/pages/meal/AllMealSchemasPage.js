import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomLink } from "../../helpers/CustomLink";
import { BsFillTrashFill } from "react-icons/bs";

const AllMealSchemasPage = () => {
    const navigate = useNavigate();
    const [mealSchemas, setMealSchemas] = useState([]);
    const [mealSchemaProduct, setMealSchemaProduct] = useState([]);
    const [weights, setWeights] = useState([]);
    const [products, setProducts] = useState([]);
    const [rows, setRows] = useState([]);
    const mealSchemasPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

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
            let tempWeights = [];
            let tempProducts = [];
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
                    tempWeights.push(weight);

                    const productResponse = await fetch(`http://localhost:8080/product/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!productResponse.ok) throw new Error(`HTTP error product! Status: ${productResponse.status}`);
                    const product = await productResponse.json();
                    tempProducts.push(product);

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

                setWeights(tempWeights);
                setProducts(tempProducts);
                setRows(
                    mealSchemas.map((schema, i) => ({
                        id: schema.id,
                        name: schema.name,
                        kcal: nutritions[i].kcal,
                        protein: nutritions[i].protein,
                        fat: nutritions[i].fat,
                        carbs: nutritions[i].carbs,
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
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(mealSchemas.length / mealSchemasPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent the row click event from firing

        const token = localStorage.getItem("token");
        let mealSchema;
        try{
            let response = await fetch(`http://localhost:8080/mealSchema/${id}`,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            mealSchema = await response.json();
        } catch (err){
            console.log(err);
        }

        try{
            let response = await fetch(`http://localhost:8080/mealSchemaProduct/deleteSchema/${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }

        try{
            let response = await fetch(`http://localhost:8080/mealSchema/delete`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(mealSchema)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Meal schema deleted successfully');
            setMealSchemas(mealSchemas.filter(schema => schema.id !== id));

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-meal-schemas">All Meal Schemas</Link>
                <Link to="/">Log out</Link>
            </nav>
            <CustomLink to="/add-meal-schema">Add Schema</CustomLink>

            {mealSchemas.length > 0 ? (
                <>
                    <nav>
                        <ul className="pagination">
                            {pageNumbers.map((number) => (
                                <li key={number} className="page-item">
                                    <button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Kcal</th>
                            <th>Białko</th>
                            <th>Tłuszcze</th>
                            <th>Węglowodany</th>
                            <th>Data utworzenia</th>
                            <th>Actions</th>
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
                                <td className="actions">
                                    <BsFillTrashFill className="delete-btn" onClick={(e) => handleDelete(row.id, e)} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No mealSchemas available.</p>
            )}
        </div>
    );
};

export default AllMealSchemasPage;
