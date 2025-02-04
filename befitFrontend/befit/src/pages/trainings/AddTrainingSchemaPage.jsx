import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/schema/AddSchemaPage.css"

const AddTrainingSchemaPage = () => {
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]); // Initialize as an empty array
    const [trainingSchemaData, setTrainingSchemaData] = useState({
        name: '',
        category: '',
        trainingSchemaExerciseIds: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/trainingSchema/categories`, {
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
                setCategories(data);
            } catch (error) {
                console.error("Fetching categories failed:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleDeleteRow = (targetId) => {
        setRows(rows.filter((_, id) => id !== targetId));
    };

    const handleEditRow = (id) => {
        setRowToEdit(id);
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setTrainingSchemaData({ ...trainingSchemaData, [e.target.name]: e.target.value });
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

        if (!trainingSchemaData.name.trim()) {
            alert('Name cannot be just spaces.');
            return;
        }

        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);

        const trainingSchemaPayload = {
            name: trainingSchemaData.name,
            category: trainingSchemaData.category,
            creatorUsername: decodedToken.sub
        };

        let seriesId;
        let trainingSchemaId;

        try {
            seriesId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    series: rows[i].series,
                    repeatNumber: rows[i].repeatNumber,
                    weight: rows[i].weight,
                };
                let response = await fetch('http://localhost:8080/series/add', {
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
                const createdSeries = await response.json();
                seriesId[i]=createdSeries.id;
            }
        } catch (error) {
            console.error('Error adding series:', error);
        }

        try {
            let response = await fetch('http://localhost:8080/trainingSchema/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(trainingSchemaPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const createdSchema = await response.json();
            console.log("createdSchema: ",createdSchema)
            trainingSchemaId = createdSchema.id;
        } catch (error) {
            console.error('Error adding training schema:', error);
        }

        let trainingSchemaExercisesId;

        try {
            trainingSchemaExercisesId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    exerciseId: rows[i].exerciseId,
                    trainingSchemaId: trainingSchemaId,
                    seriesId: seriesId[i],
                };
                let response = await fetch('http://localhost:8080/trainingSchemaExercise/add', {
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
                const createdSchemaExercise = await response.json();
                trainingSchemaExercisesId[i] = createdSchemaExercise.id;
            }
        } catch (error) {
            console.error('Error adding trainingSchemaExercise:', error);
        }

        let trainingSchemaExercises;

        try {
            trainingSchemaExercises = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                let response = await fetch(`http://localhost:8080/trainingSchemaExercise/${trainingSchemaExercisesId[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const SchemaExercise = await response.json();
                trainingSchemaExercises[i] = SchemaExercise;
            }
        } catch (error) {
            console.error('Error adding trainingSchemaExercise:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/trainingSchema/updatetse/${trainingSchemaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(trainingSchemaExercises)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            alert('Training schema added successfully');
            navigate(`/all-training-schemas`);
        } catch (error) {
            console.error('Error adding training schema:', error);
        }

    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setTrainingSchemaData({
            ...trainingSchemaData,
            category: selectedCategory
        });
    };

    const handleReturn = () => {
        navigate(`/all-training-schemas`);
    }

    return (
        <div className="addSchemaPage-container">
            <NavBar/>
            <div className="addSchemaPage">
                <label>Nazwa schematu:</label>
                <input
                    type="text"
                    name="name"
                    value={trainingSchemaData.name}
                    placeholder="Nazwa schematu"
                    onChange={handleChange}
                    required
                />
                <label>Kategoria:</label>
                <select
                    name="category"
                    value={trainingSchemaData.category || ''}
                    onChange={handleCategoryChange}
                >
                    <option value="" disabled>Wybierz kategorię</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <TrainingSchemaTable rows={rows} deleteRow={handleDeleteRow} editRow={handleEditRow}/>
                <div className="addSchemaPage-buttons-container">
                    <button className="addSchemaPage-add-btn" onClick={() => setModalOpen(true)}>Dodaj ćwiczenie</button>
                    {modalOpen && (
                        <TrainingSchemaModal
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

export default AddTrainingSchemaPage;
