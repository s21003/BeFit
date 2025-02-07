import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MealSchemaModal } from "../../components/Meal/MealSchemaModal";
import { MealSchemaTable } from "../../components/Meal/MealSchemaTable";
import NavBar from "../../components/NavBar";
import "../../styles/schema/SchemaDetailsPage.css"
import {jwtDecode} from "jwt-decode";

const DetailsMealSchemaPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([{
        productId: 0.0,
        name: '',
        kcal: 0.0,
        protein: 0.0,
        carbs: 0.0,
        weight: 0.0,
        creatorUsername: ''
    }]);
    const [mealSchemaProductData, setMealSchemaProductData] = useState([]);
    const [schemaProductData, setSchemaProductData] = useState([]);
    const [schemaWeightsData, setSchemaWeightsData] = useState([{
        id: 0.0,
        weight: 0.0,
    }]);
    const [mealSchemaData, setMealSchemaData] = useState({
        name: '',
        mealSchemaProductIds: [],
        creatorUsername: '',
        weights: []
    });

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/mealSchema/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMealSchemaData(data);
            } catch (error) {
                console.error("Fetching schema failed:", error);
            }
        };

        fetchSchema();
    }, [id]);

    useEffect(() => {
        const fetchMealSchemaProduct = async (spId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/mealSchemaProduct/${spId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Fetching schemaProduct failed:", error);
                return null;
            }
        };

        const fetchAllMealSchemaProducts = async () => {
            const schemaProducts = [];
            for (let id of mealSchemaData.mealSchemaProductIds) {
                const schemaProduct = await fetchMealSchemaProduct(id.id);
                if (schemaProduct) {
                    schemaProducts.push(schemaProduct);
                }
            }
            setMealSchemaProductData(schemaProducts);
        };

        fetchAllMealSchemaProducts();
    }, [mealSchemaData]);

    useEffect(() => {
        if (!mealSchemaProductData.length) return;

        const fetchProduct = async (Id) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/product/${Id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Fetching Product failed:", error);
                return null;
            }
        };

        const fetchAllProducts = async () => {
            const products = [];
            for (let sp of mealSchemaProductData) {
                const product = await fetchProduct(sp.productId);
                if (product) {
                    products.push(product);
                }
            }
            setSchemaProductData(products);
        };

        fetchAllProducts();
    }, [mealSchemaProductData]);

    useEffect(() => {
        if (!mealSchemaProductData.length) return;

        const fetchWeights = async (wid) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/weights/${wid}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Fetching weights failed:", error);
                return null;
            }
        };

        const fetchAllWeights = async () => {
            const weights = [];
            for (let sw of mealSchemaProductData) {
                const weight = await fetchWeights(sw.weightsId);
                if (weight) {
                    weights.push(weight);
                }
            }
            setSchemaWeightsData(weights);
        };

        fetchAllWeights();
    }, [mealSchemaProductData]);

    useEffect(() => {
        const combinedRows = schemaProductData.map((product, i) => ({
            productId: product.id,
            name: product.name,
            kcal: Math.round(product.kcal * (schemaWeightsData[i]?.weight || 0) / 100),
            protein: Math.round(product.protein * (schemaWeightsData[i]?.weight || 0) / 100),
            fat: Math.round(product.fat * (schemaWeightsData[i]?.weight || 0) / 100),
            carbs: Math.round(product.carbs * (schemaWeightsData[i]?.weight || 0) / 100),
            weight: schemaWeightsData[i]?.weight || 0,
        }));
        setRows(combinedRows);
    }, [schemaProductData]);

    const handleDeleteRow = (targetId) => {
        setRows(rows.filter((_, id) => id !== targetId));
    };

    const handleEditRow = (id) => {
        setRowToEdit(id);
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setMealSchemaData({ ...mealSchemaData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (newRow) => {
        rowToEdit === null
            ? setRows([...rows, newRow])
            : setRows(rows.map((currentRow, id) => {
                if (id !== rowToEdit) return currentRow;
                return newRow;
            }));
    };

    const handleSubmitSchema = async (e) => {
        e.preventDefault();

        if (!mealSchemaData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const token = localStorage.getItem("token");

        const mealSchemaPayload = {
            name: mealSchemaData.name,
        };

        let weightsId;
        let mealSchemaId = mealSchemaData.id;

        try {
            weightsId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    weight: rows[i].weight,
                };
                let response = await fetch('http://localhost:8080/weights/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(row),

                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const createdWeights = await response.json();
                weightsId[i]=createdWeights.id;
            }
        } catch (error) {
            console.error('Error adding weights:', error);
        }
        let mealSchemaProductsId;
        let tmpMealSchemaProductsId;
        let mealSchemaProducts;

        try {
            mealSchemaProducts = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                tmpMealSchemaProductsId = mealSchemaData.mealSchemaProductIds[i].id;
                let response = await fetch(`http://localhost:8080/mealSchemaProduct/${tmpMealSchemaProductsId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const SchemaProduct = await response.json();
                mealSchemaProducts[i] = SchemaProduct;
            }
        } catch (error) {
            console.error('Error getting mealSchemaProduct:', error);
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
            console.error(err);
        }

        try {
            mealSchemaProductsId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                const row = {
                    productId: rows[i].productId,
                    mealSchemaId: id,
                    weightsId: weightsId[i],
                };
                let response = await fetch('http://localhost:8080/mealSchemaProduct/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(row),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const createdSchemaProduct = await response.json();
                mealSchemaProductsId[i] = createdSchemaProduct.id;
            }
        } catch (error) {
            console.error('Error adding mealSchemaProduct:', error);
        }



        try {
            mealSchemaProducts = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                let response = await fetch(`http://localhost:8080/mealSchemaProduct/${mealSchemaProductsId[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const SchemaProduct = await response.json();
                mealSchemaProducts[i] = SchemaProduct;
            }
        } catch (error) {
            console.error('Error getting mealSchemaProduct:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/mealSchema/updatemsp/${mealSchemaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(mealSchemaProducts)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating meal schema:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/mealSchema/update/${mealSchemaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(mealSchemaPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error updating meal schema:', error);
        }
        alert('Meal schema edited successfully');
        navigate(`/all-meal-schemas`);
    };

    const handleReturn = () => {
        navigate(`/all-meal-schemas`);
    }

    const handleDeleteSchema = async () => {
        const confirmDelete = window.confirm("Czy jesteś pewny, że chcesz usunąć ten schemat?");

        if (confirmDelete) {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:8080/mealSchema/delete`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mealSchemaData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
                }

                alert("Schemat posiłków został usunięty.");
                navigate("/all-meal-schemas");

            } catch (error) {
                console.error("Error deleting schema:", error);
                alert("Wystąpił błąd podczas usuwania schematu.");
            }
        }
    }

    const handleRemoveSchema = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);

        try{
            const userResponse = await fetch(
                `http://localhost:8080/user/${decodedToken.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!userResponse.ok) throw new Error(`HTTP error! Status: ${userResponse.status}`);
            const userData = await userResponse.json();

            const sharedResponse = await fetch(
                `http://localhost:8080/userTrainer/sharedMealSchemas/${userData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!sharedResponse.ok) throw new Error(`HTTP error! Status: ${sharedResponse.status}`);

            const trainerResponse = await fetch(
                `http://localhost:8080/user/${mealSchemaData.creatorUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!trainerResponse.ok) throw new Error(`HTTP error! Status: ${trainerResponse.status}`);
            const trainer = await trainerResponse.json();

            const response = await fetch(
                `http://localhost:8080/userTrainer/user/${userData.id}?trainerId=${trainer.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const userTrainerData = await response.json();

            const removeResponse = await fetch(
                `http://localhost:8080/userTrainer/removeMealSchema/${userTrainerData.id}/${mealSchemaData.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (removeResponse.ok) {
                alert("Meal schema removed successfully.");
                navigate("/all-meal-schemas");
            } else {
                console.error("Error removing meal schema:", removeResponse.status);
                alert("Failed to remove meal schema.");
            }
        } catch (error) {
            console.error("Error removing schema:", error);
            alert("Wystąpił błąd podczas usuwania schematu.");
        }
    }

    const isShared = () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token)
        return decodedToken.sub === mealSchemaData.creatorUsername;
    }

    return (
        <div className="schemaDetails-container">
            <NavBar />
            <div className="schemaDetails">
                {isShared ? (
                    <>
                        <label>Nazwa schematu:</label>
                        <strong>{mealSchemaData.name}</strong>
                    </>
                ) : (
                    <>
                        <label>Nazwa schematu:</label>
                        <input
                            type="text"
                            name="name"
                            value={mealSchemaData.name}
                            placeholder="Name"
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <MealSchemaTable rows={rows} schemaProduct={schemaProductData}
                                 deleteRow={handleDeleteRow}
                                 editRow={handleEditRow}/>
                {modalOpen && (
                    <MealSchemaModal
                        closeModal={() => {
                            setModalOpen(false);
                            setRowToEdit(null);
                        }}
                        onSubmit={handleSubmit}
                        defaultValue={rowToEdit !== null && rows[rowToEdit]}
                    />
                )}
                <div className="schemaDetails-button-container">
                    {isShared ? (
                        <>
                            <button type="button" className="schemaDetails-delete-btn"
                                    onClick={handleRemoveSchema}>Usuń
                                schemat
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="submit" className="schemaDetails-add-btn"
                                    onClick={() => setModalOpen(true)}>Dodaj produkt
                            </button>
                            <button type="submit" className="schemaDetails-save-btn"
                                    onClick={handleSubmitSchema}>Zapisz
                                schemat
                            </button>
                            <button type="button" className="schemaDetails-delete-btn"
                                    onClick={handleDeleteSchema}>Usuń
                                schemat
                            </button>
                        </>
                    )}
                    <button className="schemaDetails-return-btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsMealSchemaPage;
