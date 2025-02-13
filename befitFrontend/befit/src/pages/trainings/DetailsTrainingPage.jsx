import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import NavBar from "../../components/NavBar";
import { TrainingAddSchemaModal } from "../../components/Training/TrainingAddSchemaModal";
import "../../styles/scheduler/DetailsPage.css";
import {jwtDecode} from "jwt-decode";

const DetailsTrainingPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [addSchemaModalOpen, setAddSchemaModalOpen] = useState(false);
    const [trainingExerciseData, setTrainingExerciseData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [seriesData, setSeriesData] = useState([
        {
            id: 0.0,
            series: 0.0,
            repeatNumber: 0.0,
            weight: 0.0,
        },
    ]);
    const [unsavedRows, setUnsavedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trainingData, setTrainingData] = useState({
        id: 0.0,
        category: null,
        trainingExerciseIds: [],
        creatorUsername: '',
        startTime: null,
        endTime: null,
        userUsername: '',
    });
    const [isSchemaShared, setIsSchemaShared] = useState(null);

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/training/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
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
        setIsSchemaShared(isShared());
    }, [trainingData]);

    useEffect(() => {
        const fetchTrainingExercise = async (teId) => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8080/trainingExercise/${teId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
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

        if (!trainingExerciseData.length) return;

        const fetchAllSeries = async () => {
            const series = [];
            const token = localStorage.getItem("token")

            for (let se of trainingExerciseData) {

                try {
                    if (se.seriesId) {
                        const response = await fetch(`http://localhost:8080/series/${se.seriesId}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        });
                        if (response.ok) {
                            const seriesData = await response.json()
                            series.push(seriesData)
                        }
                    }
                } catch (error) {
                    console.error("Fetching series failed:", error);
                }
            }
            setSeriesData(series);
        };

        fetchAllSeries();
    }, [trainingExerciseData]);

    useEffect(() => {
        if (isLoading) return;

        const combinedRows = exerciseData.map((exercise, i) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            series: seriesData[i]?.series || 0,
            repeatNumber: seriesData[i]?.repeatNumber || 0,
            weight: seriesData[i]?.weight || 0,
        }));

        setRows([...combinedRows,...unsavedRows]);
    }, [exerciseData, seriesData, unsavedRows, isLoading]);

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

    const handleSubmit = (newRow) => {
        if (rowToEdit === null) {
            setUnsavedRows((prevUnsavedRows) => [...prevUnsavedRows, newRow]);
            setRows((prevRows) => [...prevRows, newRow]);
        } else {
            setRows((prevRows) =>
                prevRows.map((row, idx) => (idx === rowToEdit ? newRow : row))
            );
            setUnsavedRows((prevUnsavedRows) => {
                const index = prevUnsavedRows.findIndex(
                    (row) => row.exerciseId === newRow.exerciseId
                );
                if (index !== -1) {
                    const updatedUnsaved = [...prevUnsavedRows];
                    updatedUnsaved[index] = newRow;
                    return updatedUnsaved;
                }
                return prevUnsavedRows;
            });
        }
        setRowToEdit(null);
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

    const handleReturn = () => {
        navigate(`/all-trainings`);
    }

    const handleAddTrainingExercise = (newTrainingExercises) => {
        const exercisesToAdd = newTrainingExercises.filter(newExercise =>
            !trainingExerciseData.some(existingExercise => existingExercise.exerciseId === newExercise.exerciseId)
        );

        setTrainingExerciseData((prev) => [...prev,...newTrainingExercises]);

        fetchSeriesForNewExercises(newTrainingExercises)
            .then(newSeriesData => {
                const exerciseWithSeries = exercisesToAdd.map((exercise, index) => ({
                    ...exercise,
                    series: newSeriesData[index].series,
                    repeatNumber: newSeriesData[index].repeatNumber,
                    weight: newSeriesData[index].weight,
                }));
                setUnsavedRows(prevUnsavedRows => [...prevUnsavedRows,...exerciseWithSeries]);
            })
            .catch(error => {
                console.error("Fetching series failed:", error)
            });
    };

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

        setSeriesData((prevSeries) => [...prevSeries, ...newSeriesData]);
    };

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
    }, [trainingExerciseData]);

    useEffect(() => {
        if (!trainingExerciseData.length) return;

        const fetchExerciseAndSeries = async () => {
            setIsLoading(true);
            const exercises = [];
            const series = [];
            const token = localStorage.getItem("token");

            await Promise.all(
                trainingExerciseData.map(async (te) => {
                    try {
                        const exerciseResponse = await fetch(
                            `http://localhost:8080/exercise/${te.exerciseId}`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        if (exerciseResponse.ok) {
                            const exercise = await exerciseResponse.json();
                            exercises.push(exercise);
                        }

                        const seriesResponse = await fetch(
                            `http://localhost:8080/series/${te.seriesId}`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        if (seriesResponse.ok) {
                            const seriesItem = await seriesResponse.json();
                            series.push(seriesItem);
                        }
                    } catch (error) {
                        console.error("Fetching exercise or series failed:", error);
                    }
                })
            );

            setExerciseData(exercises);
            setSeriesData(series);
            setIsLoading(false);
        };

        fetchExerciseAndSeries();
    }, [trainingExerciseData]);


    useEffect(() => {
        if (isLoading) return;

        const newRows = exerciseData.map((exercise, i) => ({
            exerciseId: exercise.id,
            name: exercise.name,
            part: exercise.part,
            videoLink: exercise.videoLink,
            series: seriesData[i]?.series || 0,
            repeatNumber: seriesData[i]?.repeatNumber || 0,
            weight: seriesData[i]?.weight || 0,
        }));

        setRows([...newRows,...unsavedRows]);
    }, [exerciseData, seriesData, unsavedRows, isLoading]);

    const isShared = () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        return decodedToken.sub !== trainingData.creatorUsername;
    };

    return (
        <div className="details-container">
            <NavBar/>
            <div className="details">
                <label htmlFor="label-select">Kategoria:</label>
                <select
                    id="category-select"
                    className="inputStyle"
                    name="category"
                    value={trainingData.category || ""}
                    onChange={(e) => setTrainingData({...trainingData, category: e.target.value})}>
                    <option value="" disabled>-- Wybierz kategorię --</option>
                    {Object.entries(categories).map(([displayCategory, internalValue]) => (
                        <option key={internalValue} value={internalValue}>
                            {displayCategory}
                        </option>
                    ))}
                </select>

                <TrainingSchemaTable
                    rows={rows}
                    trainingExercise={exerciseData}
                    deleteRow={handleDeleteRow}
                    editRow={handleEditRow}
                    isShared={isSchemaShared}
                />
                <div className="buttons-container">
                    <button className="details-add-btn" onClick={() => setModalOpen(true)}>Dodaj ćwiczenie</button>
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
                    <button className="details-add-btn" onClick={() => setAddSchemaModalOpen(true)}>Dodaj schemat</button>
                    {addSchemaModalOpen && (
                        <TrainingAddSchemaModal
                            closeModal={() => setAddSchemaModalOpen(false)}
                            onSubmit={handleAddTrainingExercise}
                            trainingId={id}
                        />
                    )}
                    <button type="submit" className="details-save-btn" onClick={handleSubmitTraining}>Zapisz trening</button>
                    <button type="submit" className="details-return-btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsTrainingPage;
