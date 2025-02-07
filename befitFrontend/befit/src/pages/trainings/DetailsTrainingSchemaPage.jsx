import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrainingSchemaModal } from "../../components/Training/TrainingSchemaModal";
import { TrainingSchemaTable } from "../../components/Training/TrainingSchemaTable";
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/schema/SchemaDetailsPage.css"

const DetailsTrainingSchemaPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [trainingSchemaExerciseData, setTrainingSchemaExerciseData] = useState([]);
    const [schemaExerciseData, setSchemaExerciseData] = useState([]);
    const [schemaSeriesData, setSchemaSeriesData] = useState([]);
    const [trainingSchemaData, setTrainingSchemaData] = useState({
        name: '',
        category: '',
        trainingSchemaExerciseIds: [],
        creatorUsername: ''
    });

    const categories = {
        "Cardio":"Cardio",
        "Siłowy":"Silowy",
        "Crossfit":"Crossfit",
        "Fitness":"Fitness",
        "Grupowy":"Grupowy"
    }

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
        console.log("schemaExerciseData: ",schemaExerciseData)
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

    const handleDeleteSchema = async () => {
        const confirmDelete = window.confirm("Czy jesteś pewny, że chcesz usunąć ten schemat?");

        if (confirmDelete) {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:8080/trainingSchema/delete`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trainingSchemaData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
                }

                alert("Schemat treningowy został usunięty.");
                navigate("/all-training-schemas");

            } catch (error) {
                console.error("Error deleting schema:", error);
                alert("Wystąpił błąd podczas usuwania schematu.");
            }
        }
    }

    const handleReturn = () => {
        navigate(`/all-training-schemas`);
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
                `http://localhost:8080/userTrainer/sharedTrainingSchemas/${userData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!sharedResponse.ok) throw new Error(`HTTP error! Status: ${sharedResponse.status}`);

            const trainerResponse = await fetch(
                `http://localhost:8080/user/${trainingSchemaData.creatorUsername}`, {
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
                `http://localhost:8080/userTrainer/removeTrainingSchema/${userTrainerData.id}/${trainingSchemaData.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (removeResponse.ok) {
                alert("Training schema removed successfully.");
                navigate("/all-training-schemas");
            } else {
                console.error("Error removing training schema:", removeResponse.status);
                alert("Failed to remove training schema.");
            }
        } catch (error) {
            console.error("Error removing schema:", error);
            alert("Wystąpił błąd podczas usuwania schematu.");
        }

    }

    const isShared = () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token)
        return decodedToken.sub === trainingSchemaData.creatorUsername;
    }

    return (
        <div className="schemaDetails-container">
            <NavBar/>
            <div className="schemaDetails">
                {isShared ? (
                    <>
                        <label>Nazwa schematu:</label>
                        <strong>{trainingSchemaData.name}</strong>
                        <label>Kategoria:</label>
                        <strong>{trainingSchemaData.category}</strong>
                    </>
                ) : (
                    <>
                        <label>Nazwa schematu:</label>
                        <input
                            type="text"
                            name="name"
                            value={trainingSchemaData.name}
                            placeholder="Name"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="category-select">Kategoria:</label>
                        <select
                            id="category-select"
                            className="inputStyle"
                            name="category"
                            value={trainingSchemaData.category || ""}
                            onChange={(e) => setTrainingSchemaData({...trainingSchemaData, category: e.target.value})}>
                            <option value="" disabled>-- Wybierz kategorię --</option>
                            {Object.entries(categories).map(([displayCategory, internalValue]) => (
                                <option key={internalValue} value={internalValue}>
                                    {displayCategory}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <TrainingSchemaTable rows={rows} schemaExercise={schemaExerciseData}
                                     deleteRow={handleDeleteRow}
                                     editRow={handleEditRow}/>
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
                                    onClick={() => setModalOpen(true)}>Dodaj ćwiczenie
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
}

export default DetailsTrainingSchemaPage;
