import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MealSchemaModal } from "../../components/Meal/MealSchemaModal";
import { MealSchemaTable } from "../../components/Meal/MealSchemaTable";
import NavBar from "../../components/NavBar";
import {MealAddSchemaModal} from "../../components/Meal/MealAddSchemaModal";
import "../../styles/scheduler/DetailsPage.css"

const DetailsMealPage = () => {
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
    }]);
    const [mealProductData, setMealProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [weightsData, setWeightsData] = useState([{
        id: 0.0,
        weight: 0.0,
    }]);
    const [unsavedRows, setUnsavedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addSchemaModalOpen, setAddSchemaModalOpen] = useState(false);
    const [mealData, setMealData] = useState({
        id: 0.0,
        label: null,
        mealProductIds: [],
        creatorUsername: '',
        startTime: null,
        endTime: null,
        userUsername: ''
    });

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/meal/${id}`, {
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
                setMealData(data);
            } catch (error) {
                console.error("Fetching meal failed:", error);
            }
        };

        fetchMeal();
    }, [id]);

    useEffect(() => {
        const fetchMealProduct = async (mpId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/mealProduct/${mpId}`, {
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

        const fetchAllMealProducts = async () => {
            const products = [];
            for (let id of mealData.mealProductIds) {
                const product = await fetchMealProduct(id.id);
                if (product) {
                    products.push(product);
                }
            }
            setMealProductData(products);
        };

        fetchAllMealProducts();
    }, [mealData]);

    useEffect(() => {
        if (!mealProductData.length) return;

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
            for (let mp of mealProductData) {
                const product = await fetchProduct(mp.productId);
                if (product) {
                    products.push(product);
                }
            }
            setProductData(products);
        };

        fetchAllProducts();
    }, [mealProductData]);

    useEffect(() => {
        if (!mealProductData.length) return;

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

        if (!mealProductData.length) return;

        const fetchAllWeights = async () => {
            const weights = [];
            const token = localStorage.getItem("token")

            for (let mw of mealProductData) {
                try {
                    if (mw.weightsId) {
                        const response = await fetch(`http://localhost:8080/weights/${mw.weightsId}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        if (response.ok) {
                            const weight = await response.json();
                            weights.push(weight);
                        }
                    }
                } catch (error) {
                    console.error("Fetching weights failed:", error);
                }
            }

            setWeightsData(weights);
        };

        fetchAllWeights();
    }, [mealProductData]);

    useEffect(() => {
        const combinedRows = productData.map((product, i) => ({
            productId: product.id,
            name: product.name,
            kcal: product.kcal * (weightsData[i]?.weight || 0) / 100,
            protein: product.protein * (weightsData[i]?.weight || 0) / 100,
            fat: product.fat * (weightsData[i]?.weight || 0) / 100,
            carbs: product.carbs * (weightsData[i]?.weight || 0) / 100,
            weight: weightsData[i]?.weight || 0,
        }));

        setRows(combinedRows);
    }, [productData]);

    const labels = {
        "Śniadanie":"Sniadanie",
        "Drugie śniadanie":"DrugieSniadanie",
        "Obiad":"Obiad",
        "Przekąska":"Przekaska",
        "Kolacja":"Kolacja"
    }

    const handleDeleteRow = (targetId) => {
        setRows(rows.filter((_, id) => id !== targetId));
    };

    const handleEditRow = (id) => {
        setRowToEdit(id);
        setModalOpen(true);
    };

    const handleSubmit = (newRow) => {
        setUnsavedRows(prevUnsavedRows => [...prevUnsavedRows, newRow]);

        rowToEdit === null
            ? setRows([...rows, newRow])
            : setRows(rows.map((currentRow, id) => {
                if (id !== rowToEdit) return currentRow;
                return newRow;
            }));
    };

    const handleSubmitMeal = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        let weightsId;
        let mealId = mealData.id;
        console.log("mealId: "+mealId)

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
        let mealProductsId;
        let mealProducts;

        try {
            mealProductsId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                const row = {
                    productId: rows[i].productId,
                    mealId: id,
                    weightsId: weightsId[i],
                };
                let response = await fetch('http://localhost:8080/mealProduct/add', {
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
                const createdMealProduct = await response.json();
                mealProductsId[i] = createdMealProduct.id;
            }
        } catch (error) {
            console.error('Error adding mealProduct:', error);
        }

        try {
            mealProducts = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                let response = await fetch(`http://localhost:8080/mealProduct/${mealProductsId[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const product = await response.json();
                mealProducts[i] = product;
                console.log("mealProducts[",i,"]: ", mealProducts[i])
            }
        } catch (error) {
            console.error('Error getting mealProduct:', error);
        }

        try{
            let response = await fetch(`http://localhost:8080/mealProduct/delete/${id}`,{
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

        try {
            mealProductsId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                const row = {
                    productId: rows[i].productId,
                    mealId: id,
                    weightsId: weightsId[i],
                };
                let response = await fetch('http://localhost:8080/mealProduct/add', {
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
                const createdMealProduct = await response.json();
                mealProductsId[i] = createdMealProduct.id;
            }
        } catch (error) {
            console.error('Error adding mealProduct:', error);
        }



        try {
            mealProducts = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                let response = await fetch(`http://localhost:8080/mealProduct/${mealProductsId[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const product = await response.json();
                mealProducts[i] = product;
            }
        } catch (error) {
            console.error('Error getting mealProduct:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/meal/updatemp/${mealId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(mealProducts)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating meal:', error);
        }

        try {
            const row = {
                label: mealData.label,
                creatorUsername: mealData.creatorUsername,
                creationDate: mealData.creationDate,
                startTime: mealData.startTime,
                endTime: mealData.endTime,
            }

            let response = await fetch(`http://localhost:8080/meal/update/${mealId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(row)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error updating meal :', error);
        }

        alert('Meal edited successfully');
        navigate(`/all-meals`);

        console.log("meal: ",JSON.stringify(mealProducts))

    };

    const handleReturn = () => {
        navigate(`/all-meals`);
    }

    const handleAddMealProducts = (newMealProducts) => {
        const productsToAdd = newMealProducts.filter(newProduct =>
            !mealProductData.some(existingProduct => existingProduct.productId === newProduct.productId)
        );

        setMealProductData((prev) => [...prev,...newMealProducts]);

        fetchWeightsForNewProducts(newMealProducts)
            .then(newWeightsData => {
                const productsWithWeights = productsToAdd.map((product, index) => ({
                    ...product,
                    weight: newWeightsData[index].weight
                }));
                setUnsavedRows(prevUnsavedRows => [...prevUnsavedRows,...productsWithWeights]);
            })
            .catch(error => {
                console.error("Fetching weights failed:", error);
            });
    };

    const fetchWeightsForNewProducts = async (newMealProducts) => {
        const newWeightsData = [];
        const token = localStorage.getItem("token");

        for (let product of newMealProducts) {
            try {
                const response = await fetch(`http://localhost:8080/weights/${product.weightsId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const weight = await response.json();
                    newWeightsData.push(weight);
                }
            } catch (error) {
                console.error("Fetching weights failed:", error);
            }
        }

        setWeightsData((prevWeights) => [...prevWeights, ...newWeightsData]);
    };

    useEffect(() => {
        if (!mealProductData.length) return;

        const fetchAllWeights = async () => {
            const weights = [];
            for (let mw of mealProductData) {
                try {
                    const response = await fetch(`http://localhost:8080/weights/${mw.weightsId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const weight = await response.json();
                        weights.push(weight);
                    }
                } catch (error) {
                    console.error("Fetching weights failed:", error);
                }
            }

            setWeightsData(weights);
        };

        fetchAllWeights();
    }, [mealProductData]);

    useEffect(() => {
        if (!mealProductData.length) return;

        const fetchProductAndWeights = async () => {
            setIsLoading(true);

            const products = [];
            const weights = [];
            const token = localStorage.getItem("token");

            await Promise.all(mealProductData.map(async (mp) => {
                try {
                    const productResponse = await fetch(`http://localhost:8080/product/${mp.productId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (productResponse.ok) {
                        const product = await productResponse.json();
                        products.push(product);
                    }

                    const weightResponse = await fetch(`http://localhost:8080/weights/${mp.weightsId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (weightResponse.ok) {
                        const weight = await weightResponse.json();
                        weights.push(weight);
                    }
                } catch (error) {
                    console.error("Fetching product or weight failed:", error);
                }
            }));

            setProductData(products);
            setWeightsData(weights);
            setIsLoading(false);
        };

        fetchProductAndWeights();
    }, [mealProductData]);

    useEffect(() => {
        if (isLoading) return;

        const newRows = productData.map((product, i) => ({
            productId: product.id,
            name: product.name,
            kcal: Math.round(product.kcal * (weightsData[i]?.weight || 0) / 100),
            protein: Math.round(product.protein * (weightsData[i]?.weight || 0) / 100),
            fat: Math.round(product.fat * (weightsData[i]?.weight || 0) / 100),
            carbs: Math.round(product.carbs * (weightsData[i]?.weight || 0) / 100),
            weight: (weightsData[i]?.weight || 0),
        }));

        setRows([...newRows,...unsavedRows]);
    }, [productData, weightsData, unsavedRows, isLoading]);

    return (
        <div className="details-container">
            <NavBar/>
            <div className="details">
                <label htmlFor="label-select">Etykieta:</label>
                <select
                    id="label-select"
                    className="inputStyle"
                    name="label"
                    value={mealData.label || ""} // Ensure controlled component with fallback for null/undefined
                    onChange={(e) => setMealData({...mealData, label: e.target.value})}>
                    <option value="" disabled>-- Wybierz etykietę --</option>
                    {Object.entries(labels).map(([displayLabel, internalValue]) => (
                        <option key={internalValue} value={internalValue}>
                            {displayLabel}
                        </option>
                    ))}
                </select>

                <MealSchemaTable rows={rows} product={productData} deleteRow={handleDeleteRow} editRow={handleEditRow}/>
                <div className="details-buttons-container">
                    <button className="details-add-btn" onClick={() => setModalOpen(true)}>Dodaj produkt</button>
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
                    <button className="details-add-btn" onClick={() => setAddSchemaModalOpen(true)}>Dodaj schemat</button>
                    {addSchemaModalOpen && (
                        <MealAddSchemaModal
                            closeModal={() => setAddSchemaModalOpen(false)}
                            onSubmit={handleAddMealProducts}
                            mealId={id}
                        />
                    )}
                    <button className="details-save-btn" type="submit" onClick={handleSubmitMeal}>Zapisz posiłek</button>
                    <button className="details-return-btn" type="submit" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsMealPage;
