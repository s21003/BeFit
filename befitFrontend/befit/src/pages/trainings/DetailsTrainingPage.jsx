import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import NavBar from "../../components/NavBar";
import {TrainingAddSchemaModal} from "../../components/Training/TrainingAddSchemaModal";
import "../../styles/DetailsPage.css"

const DetailsTrainingPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([{
        exerciseId: 0.0,
        name: '',
        series: 0.0,
        repeatNumber: 0.0,
        weight: 0.0,
    }]);
    const [addSchemaModalOpen, setAddSchemaModalOpen] = useState(false);
    const [trainingExerciseData, setTrainingExerciseData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [seriesData, setSeriesData] = useState([{
        id: 0.0,
        series: 0.0,
        repeatNumber: 0.0,
        weight: 0.0,
    }]);
    const [trainingData, setTrainingData] = useState({
        id: 0.0,
        category: '',
        trainingExerciseIds: [],
        creatorUsername: '',
        startTime: null,
        endTime: null,
        userUsername: ''
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
            const exercises = [];
            for (let id of trainingData.trainingExerciseIds) {
                const exercise = await fetchTrainingExercise(id.id);
                if (exercise) {
                    exercises.push(exercise);
                }
            }
            setTrainingExerciseData(exercises);
        };

        fetchAllTrainingExercises();
    }, [trainingData]);

    useEffect(() => {
        if (!trainingExerciseData.length) return;

        const fetchExercise = async (Id) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/exercise/${Id}`, {
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
            for (let te of trainingExerciseData) {
                const exercise = await fetchExercise(te.exerciseId);
                if (exercise) {
                    exercises.push(exercise);
                }
            }
            setExerciseData(exercises);
        };

        fetchAllExercises();
    }, [trainingExerciseData]);

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
        const combinedRows = exerciseData.map((exercise, i) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            seriesId: seriesData[i].id,
            series: seriesData[i].series,
            repeatNumber: seriesData[i].repeatNumber,
            weight: seriesData[i].weight,
        }));

        setRows(combinedRows);
    }, [exerciseData, seriesData]);

    const categories = {
        "Cardio":"Cardio",
        "Siłowy":"Silowy",
        "Crossfit":"Crossfit",
        "Fitness":"Fitness",
        "Grupowy":"Grupowy"
    };

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

        let seriesId;
        let trainingId = trainingData.id;

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
        let trainingExercise;

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
                const createdTrainingExercise = await response.json();
                trainingExercisesId[i] = createdTrainingExercise.id;
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
                const exercise = await response.json();
                trainingExercises[i] = exercise;
            }
        } catch (error) {
            console.error('Error adding trainingExercise:', error);
        }

        try{
            let response = await fetch(`http://localhost:8080/trainingExercise/delete/${id}`,{
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
                const createdTrainingExercise = await response.json();
                trainingExercisesId[i] = createdTrainingExercise.id;
            }
        } catch (error) {
            console.error('Error adding trainingExercise:', error);
        }

        try {
            trainingExercises = new Array(rows.length);
            for (let i=0; i < rows.length; i++) {
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
                const exercise = await response.json();
                trainingExercises[i] = exercise;
            }
        } catch (error) {
            console.error('Error getting trainingExercise:', error);
        }

        try {
            let response = await fetch(`http://localhost:8080/training/updatete/${trainingId}`, {
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
                startTime: trainingData.startTime,
                endTime: trainingData.endTime,
            };

            let response = await fetch(`http://localhost:8080/training/update/${trainingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(row)
            })
            alert('Training edited successfully');
            navigate(`/all-trainings`);
        } catch (err){
            console.error('Error adding training :', err);
        }

    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setTrainingData({
            ...trainingData,
            category: selectedCategory
        });
    };

    const handleReturn = () => {
        navigate(`/all-trainings`);
    }

    const handleAddTrainingExercise = (newTrainingExercises) => {
        console.log("newTrainingExercises: ",newTrainingExercises);
        setTrainingExerciseData((prev) => [...prev, ...newTrainingExercises]);
        fetchSeriesForNewExercises(newTrainingExercises);
    }

    const fetchSeriesForNewExercises = async (newTrainingExercises) => {
        const newSeriesData = [];
        const token = localStorage.getItem("token");

        for (let exercise of newTrainingExercises) {
            try {
                const response = await fetch(`http://localhost:8080/series/${exercise.seriesId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const series = await response.json();
                    newSeriesData.push(series);
                }
            } catch (error) {
                console.error("Fetching series failed:", error);
            }
        }

        // Update series data with the newly fetched series
        setSeriesData((prevSeries) => [...prevSeries, ...newSeriesData]);
    };

// This effect will be triggered when `trainingExerciseData` or `seriesData` is updated
    useEffect(() => {
        if (!trainingExerciseData.length) return;

        const fetchAllSeries = async () => {
            const series = [];
            for (let te of trainingExerciseData) {
                try {
                    const response = await fetch(`http://localhost:8080/series/${te.seriesId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const seriesItem = await response.json();
                        series.push(seriesItem);
                    }
                } catch (error) {
                    console.error("Fetching series failed:", error);
                }
            }

            setSeriesData(series);
        };

        fetchAllSeries();
    }, [trainingExerciseData]);  // Fetch series when trainingExerciseData changes

    useEffect(() => {
        console.log("seriesData: ", seriesData);
        const combinedRows = exerciseData.map((exercise, i) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            series: seriesData[i]?.series || 0,  // Use series data for the corresponding exercise
            repeatNumber: seriesData[i]?.repeatNumber || 0,  // Fetch repeat number from the series
            weight: seriesData[i]?.weight || 0,  // Fetch weight from the series
        }));

        setRows(combinedRows);
    }, [exerciseData, seriesData]);  // Update combined rows when either exerciseData or seriesData changes


    return (
        <div className="details-container">
            <NavBar/>
            <div className="details">
                <label htmlFor="label-select">Kategoria:</label>
                <select
                    id="category-select"
                    className="inputStyle"
                    name="category"
                    value={trainingData.category || ""} // Ensure controlled component with fallback for null/undefined
                    onChange={(e) => setTrainingData({...trainingData, category: e.target.value})}>
                    <option value="" disabled>-- Wybierz kategorię --</option>
                    {Object.entries(categories).map(([displayCategory, internalValue]) => (
                        <option key={internalValue} value={internalValue}>
                            {displayCategory}
                        </option>
                    ))}
                </select>
                <TrainingSchemaTable rows={rows} trainingExercise={exerciseData} deleteRow={handleDeleteRow} editRow={handleEditRow}/>
                <div className="buttons-container">
                    <button className="btn" onClick={() => setModalOpen(true)}>Dodaj ćwiczenie</button>
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
                    <button className="btn" onClick={() => setAddSchemaModalOpen(true)}>Dodaj schemat</button>
                    {addSchemaModalOpen && (
                        <TrainingAddSchemaModal
                            closeModal={() => setAddSchemaModalOpen(false)}
                            onSubmit={handleAddTrainingExercise}
                            mealId={id}
                        />
                    )}
                    <button type="submit" className="btn" onClick={handleSubmitTraining}>Zapisz trening</button>
                    <button type="submit" className="btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsTrainingPage;
