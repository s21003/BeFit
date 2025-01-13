import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import '../../styles/Schema.css';
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import {jwtDecode} from "jwt-decode";

const DetailsTrainingSchemaPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trainingSchemaExerciseData, setTrainingSchemaExerciseData] = useState([]);
    const [schemaExerciseData, setSchemaExerciseData] = useState([]);
    const [schemaSeriesData, setSchemaSeriesData] = useState([]);
    const [trainingSchemaData, setTrainingSchemaData] = useState({
        name: '',
        category: '',
        trainingSchemaExerciseIds: [],
        creatorUsername: ''
    });

    // Fetch the training schema data
    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/trainingSchema/${id}`, {
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
                setTrainingSchemaData(data);
            } catch (error) {
                console.error("Fetching schema failed:", error);
            }
        };

        fetchSchema();
    }, [id]);

    // Fetch the training schema exercises
    useEffect(() => {
        if (!trainingSchemaData.trainingSchemaExerciseIds.length) return;

        const fetchTrainingSchemaExercise = async (seId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/trainingSchemaExercise/${seId}`, {
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
                console.error("Fetching schemaExercise failed:", error);
                return null;
            }
        };

        const fetchAllTrainingSchemaExercises = async () => {
            const schemaExercises = [];
            for (let id of trainingSchemaData.trainingSchemaExerciseIds) {
                const schemaExercise = await fetchTrainingSchemaExercise(id.id);
                if (schemaExercise) {
                    schemaExercises.push(schemaExercise);
                }
            }
            setTrainingSchemaExerciseData(schemaExercises);
        };

        fetchAllTrainingSchemaExercises();
    }, [trainingSchemaData]);

    // Fetch exercises based on training schema exercise data
    useEffect(() => {
        if (!trainingSchemaExerciseData.length) return;

        const fetchExercise = async (exId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/exercise/${exId}`, {
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
                console.error("Fetching exercise failed:", error);
                return null;
            }
        };

        const fetchAllExercises = async () => {
            const exercises = [];
            for (let se of trainingSchemaExerciseData) {
                const exercise = await fetchExercise(se.exerciseId);
                if (exercise) {
                    exercises.push(exercise);
                }
            }
            setSchemaExerciseData(exercises);
        };

        fetchAllExercises();
    }, [trainingSchemaExerciseData]);

    // Fetch series based on training schema exercise data
    useEffect(() => {
        if (!trainingSchemaExerciseData.length) return;

        const fetchSeries = async (sId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/series/${sId}`, {
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
                console.error("Fetching series failed:", error);
                return null;
            }
        };

        const fetchAllSeries = async () => {
            const series = [];
            for (let se of trainingSchemaExerciseData) {
                const serie = await fetchSeries(se.seriesId);
                if (serie) {
                    series.push(serie);
                }
            }
            setSchemaSeriesData(series);
        };

        fetchAllSeries();
    }, [trainingSchemaExerciseData]);

    useEffect(() => {
        if (!schemaExerciseData.length || !schemaSeriesData.length) return;

        const combinedRows = schemaExerciseData.map((exercise, index) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            seriesId: schemaSeriesData[index].id,
            series: schemaSeriesData[index].series,
            repeatNumber: schemaSeriesData[index].repeatNumber,
            weight: schemaSeriesData[index].weight,
        }));

        setRows(combinedRows);
    }, [schemaExerciseData, schemaSeriesData]);

    // Fetch categories
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

        try {
            seriesId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
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
                seriesId[i] = createdSeries.id;
            }
        } catch (error) {
            console.error('Error adding series:', error);
        }

        let trainingSchemaExercisesId;

        try {
            trainingSchemaExercisesId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                const row = {
                    exerciseId: rows[i].exerciseId,
                    trainingSchemaId: id,
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
            for (let i = 0; i < rows.length; i++) {
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
            let response = await fetch(`http://localhost:8080/trainingSchema/updatetse/${id}`, {
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

        } catch (error) {
            console.error('Error adding training schema:', error);
        }

        try {
            const row = {
                name: trainingSchemaData.name,
                category: trainingSchemaData.category,
                creatorUsername: trainingSchemaData.creatorUsername,
                creationDate: trainingSchemaData.creationDate,
            };

            let response = await fetch(`http://localhost:8080/trainingSchema/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(row)
            })
        } catch (err){
            console.error('Error adding training schema:', err);
        }

        try {
            trainingSchemaExercisesId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    exerciseId: rows[i].exerciseId,
                    trainingSchemaId: id,
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
            alert('Training schema edited successfully');
            navigate(`/all-training-schemas`);
        } catch (error) {
            console.error('Error adding trainingSchemaExercise:', error);
        }



    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setTrainingSchemaData({
            ...trainingSchemaData,
            category: selectedCategory
        });
    };




    return (
        <div className="TrainingSchema">
            <nav className="mainNavigation">
                <Link to="/all-training-schemas">All Training Schemas</Link>
                <Link to="/">Log out</Link>
            </nav>
            <label>Schema name:</label>
            <input
                type="text"
                name="name"
                value={trainingSchemaData.name}
                placeholder="Name"
                onChange={handleChange}
                required
            />
            <label>Category:</label>
            <select
                name="category"
                value={trainingSchemaData.category || ''}
                onChange={handleCategoryChange}
            >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            <TrainingSchemaTable rows={rows} schemaExercise={schemaExerciseData} deleteRow={handleDeleteRow} editRow={handleEditRow} />
            <button className="btn" onClick={() => setModalOpen(true)}>Add</button>
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
            <button type="submit" onClick={handleSubmitSchema}>Save Schema</button>
        </div>
    );
};

export default DetailsTrainingSchemaPage;
