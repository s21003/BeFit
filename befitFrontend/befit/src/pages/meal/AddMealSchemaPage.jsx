import React, {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import { MealSchemaModal } from "../../components/Meal/MealSchemaModal";
import { MealSchemaTable } from "../../components/Meal/MealSchemaTable";
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/schema/AddSchemaPage.css"

const AddMealSchemaPage = () => {
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [mealSchemaData, setMealSchemaData] = useState({
        name: '',
        mealSchemaProductIds: []
    });


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
        const decodedToken = jwtDecode(token);

        const mealSchemaPayload = {
            name: mealSchemaData.name,
            creatorUsername: decodedToken.sub
        };

        let weightsId;
        let mealSchemaId;

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

        try {
            let response = await fetch('http://localhost:8080/mealSchema/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(mealSchemaPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const createdSchema = await response.json();
            mealSchemaId = createdSchema.id;
        } catch (error) {
            console.error('Error adding meal schema:', error);
        }

        let mealSchemaProductsId;

        try {
            mealSchemaProductsId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    productId: rows[i].productId,
                    mealSchemaId: mealSchemaId,
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

        let mealSchemaProducts;

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
            alert('Meal schema added successfully');
            navigate(`/all-meal-schemas`);
        } catch (error) {
            console.error('Error adding meal schema:', error);
        }

    };

    const handleReturn = () => {
        navigate(`/all-meal-schemas`);
    };

    return (
        <div className="addSchemaPage-container">
            <NavBar/>
            <div className="addSchemaPage">
                <label>Nazwa schematu:</label>
                <input
                    type="text"
                    name="name"
                    value={mealSchemaData.name}
                    placeholder="Nazwa schematu"
                    onChange={handleChange}
                    required
                />
                <MealSchemaTable
                    rows={rows}
                    deleteRow={handleDeleteRow}
                    editRow={handleEditRow}
                    isShared={true}
                />
                <div className="addSchemaPage-buttons-container">
                    <button className="addSchemaPage-add-btn" onClick={() => setModalOpen(true)}>Dodaj produkt</button>
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
                    <button className="addSchemaPage-save-btn" type="submit" onClick={handleSubmitSchema}>Zapisz schemat</button>
                    <button className="addSchemaPage-return-btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default AddMealSchemaPage;
