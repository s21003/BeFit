import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import '../../styles/Schema.css';
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import {jwtDecode} from "jwt-decode";

const DetailsTrainingPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trainingExerciseData, setTrainingExerciseData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [trainingData, setTrainingData] = useState({
        category: '',
        trainingExerciseIds: [],
        creatorUsername: ''
    });

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("token "+token)
                const response = await fetch(`http://localhost:8080/training/${id}`, {
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
                setTrainingData(data);
            } catch (error) {
                console.error("Fetching training failed:", error);
            }
        };

        fetchTraining();
    }, [id]);

    useEffect(() => {
        if (!trainingData.trainingExerciseIds.length) return;

        const fetchTrainingExercise = async (teId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/trainingExercise/${teId}`, {
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
                console.error("Fetching trainingExercise failed:", error);
                return null;
            }
        };

        const fetchAllTrainingExercises = async () => {
            const trainingExercises = [];
            for (let id of trainingData.trainingExerciseIds) {
                const trainingExercise = await fetchTrainingExercise(id.id);
                if (trainingExercise) {
                    trainingExercises.push(trainingExercise);
                }
            }
            setTrainingExerciseData(trainingExercises);
        };

        fetchAllTrainingExercises();
    }, [trainingData]);

    useEffect(() => {
        if (!trainingExerciseData.length) return;

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
            for (let se of trainingExerciseData) {
                const exercise = await fetchExercise(se.exerciseId);
                if (exercise) {
                    exercises.push(exercise);
                }
            }
            setExerciseData(exercises);
        };

        fetchAllExercises();
    }, [exerciseData]);

    useEffect(() => {
        if (!trainingExerciseData.length) return;

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
            for (let se of trainingExerciseData) {
                const serie = await fetchSeries(se.seriesId);
                if (serie) {
                    series.push(serie);
                }
            }
            setSeriesData(series);
        };

        fetchAllSeries();
    }, [trainingExerciseData]);

    useEffect(() => {
        if (!exerciseData.length || !seriesData.length) return;

        const combinedRows = exerciseData.map((exercise, index) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            seriesId: seriesData[index].id,
            series: seriesData[index].series,
            repeatNumber: seriesData[index].repeatNumber,
            weight: seriesData[index].weight,
        }));

        setRows(combinedRows);
    }, [exerciseData, seriesData]);

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
        setTrainingData({ ...trainingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (newRow) => {
        rowToEdit === null
            ? setRows([...rows, newRow])
            : setRows(rows.map((currentRow, id) => {
                if (id !== rowToEdit) return currentRow;
                return newRow;
            }));
    };

    const handleSubmitTraining = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);

        const trainingPayload = {
            category: trainingData.category,
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

        let trainingExercisesId;

        try {
            trainingExercisesId = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                const row = {
                    exerciseId: rows[i].exerciseId,
                    trainingId: id,
                    seriesId: seriesId[i],
                };
                let response = await fetch('http://localhost:8080/trainingExercise/add', {
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
                const createdExercise = await response.json();
                trainingExercisesId[i] = createdExercise.id;
            }
        } catch (error) {
            console.error('Error adding trainingExercise:', error);
        }

        let trainingExercises;

        try {
            trainingExercises = new Array(rows.length);
            for (let i = 0; i < rows.length; i++) {
                let response = await fetch(`http://localhost:8080/trainingExercise/${trainingExercisesId[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const trainingExercise = await response.json();
                trainingExercises[i] = trainingExercise;
            }
        } catch (error) {
            console.error('Error adding trainingExercise:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/training/updatete/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(trainingExercises)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error adding training:', error);
        }

        try {
            const row = {
                category: trainingData.category,
                creatorUsername: trainingData.creatorUsername,
                creationDate: trainingData.creationDate,
            };

            let response = await fetch(`http://localhost:8080/training/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(row)
            })
        } catch (err){
            console.error('Error adding training :', err);
        }

        try {
            trainingExercisesId = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
                const row = {
                    exerciseId: rows[i].exerciseId,
                    trainingId: id,
                    seriesId: seriesId[i],
                };
                let response = await fetch('http://localhost:8080/trainingExercise/add', {
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
                const createdExercise = await response.json();
                trainingExercisesId[i] = createdExercise.id;
            }
            alert('Training edited successfully');
            navigate(`/all-trainings`);
        } catch (error) {
            console.error('Error adding trainingExercise:', error);
        }



    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setTrainingData({
            ...trainingData,
            category: selectedCategory
        });
    };




    return (
        <div className="Training">
            <nav className="mainNavigation">
                <Link to="/all-trainings">All Trainings</Link>
                <Link to="/">Log out</Link>
            </nav>
            <label>Category:</label>
            <select
                name="category"
                value={trainingData.category || ''}
                onChange={handleCategoryChange}
            >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            <TrainingSchemaTable rows={rows} trainingExercise={exerciseData} deleteRow={handleDeleteRow} editRow={handleEditRow} />
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
            <button type="submit" onClick={handleSubmitTraining}>Save training</button>
        </div>
    );
};

export default DetailsTrainingPage;
