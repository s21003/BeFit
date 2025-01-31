import React, {useEffect, useState, useRef} from 'react';
import {
    ScheduleComponent,
    Day,
    Week,
    Month,
    Inject,
    ViewsDirective,
    ViewDirective
} from '@syncfusion/ej2-react-schedule';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";
import {CustomLink} from "../../helpers/CustomLink";
import {L10n, loadCldr, setCulture} from "@syncfusion/ej2-base";
import "../../styles/SchedulePage.css"
import plNumberData from '@syncfusion/ej2-cldr-data/main/pl/numbers.json';
import pltimeZoneData from '@syncfusion/ej2-cldr-data/main/pl/timeZoneNames.json';
import plGregorian from '@syncfusion/ej2-cldr-data/main/pl/ca-gregorian.json';
import plNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import plWeekData from '@syncfusion/ej2-cldr-data/supplemental/weekData.json';

loadCldr(plNumberData, pltimeZoneData, plGregorian, plNumberingSystem, plWeekData);
setCulture('pl');

const AllTrainingsPage = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [trainingExercisesMap, setTrainingExercisesMap] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedTrainingId, setSelectedTrainingId] = useState(null); // Track selected training ID
    const scheduleObj = useRef(null);

    const categories = {
        "Cardio": "Cardio",
        "Siłowy": "Silowy",
        "Crossfit": "Crossfit",
        "Fitness": "Fitness",
        "Grupowy": "Grupowy"
    };

    useEffect(() => {
        const fetchTrainings = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const userUsername = decodedToken.sub;

                try {
                    const response = await fetch(`http://localhost:8080/training/user/${userUsername}`, {
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

                    const mappedData = data.map(training => ({
                        id: training.id,
                        Subject: training.category,
                        StartTime: training.startTime,
                        EndTime: training.endTime,
                        trainingExerciseIds: training.trainingExerciseIds,
                        IsAllDay: false,
                        trainerId: training.trainerId
                    }));
                    setTrainings(mappedData);
                } catch (error) {
                    console.error("Fetching trainings failed: ", error);
                }
            } else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchTrainings();
    }, [navigate]);

    useEffect(() => {
        const fetchExercisesForTrainings = async () => {
            const token = localStorage.getItem("token");
            if (token && trainings.length > 0) {
                try {
                    const newTrainingExercisesMap = {};

                    for (const training of trainings) {
                        const exercisesForTraining = [];

                        for (const exerciseId of training.trainingExerciseIds) {
                            const exerciseResponse = await fetch(
                                `http://localhost:8080/exercise/${exerciseId.exerciseId}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!exerciseResponse.ok) {
                                const errorText = await exerciseResponse.text();
                                console.error("API error:", errorText);
                                throw new Error(`HTTP error! status: ${exerciseResponse.status}`);
                            }

                            const exercise = await exerciseResponse.json();

                            const seriesResponse = await fetch(
                                `http://localhost:8080/series/${exerciseId.seriesId}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!seriesResponse.ok) {
                                const errorText = await seriesResponse.text();
                                console.error("API error:", errorText);
                                throw new Error(`HTTP error! status: ${seriesResponse.status}`);
                            }

                            const seriesData = await seriesResponse.json();
                            exercisesForTraining.push({
                                exerciseId: exercise.id,
                                name: exercise.name,
                                series: seriesData.series,
                                repeatNumber: seriesData.repeatNumber,
                                weight: seriesData.weight,
                            });
                        }
                        newTrainingExercisesMap[training.id] = exercisesForTraining;
                    }
                    setTrainingExercisesMap(newTrainingExercisesMap);
                } catch (error) {
                    console.error("Fetching exercises for trainings failed:", error);
                }
            }
        };

        fetchExercisesForTrainings();
    }, [trainings]);

    const editorTemplate = (props) => {
        if (!props) {
            return <div>No props data available</div>;
        }

        const isNewTraining = !props.id;
        const trainingExercises = trainingExercisesMap[props.id] || [];

        const [trainer, setTrainer] = useState(null);

        useEffect(() => {
            const fetchTrainer = async () => {
                if (props.trainerId) {  // changed TrainerId to trainerId here
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`http://localhost:8080/trainer/${props.trainerId}`, {  // changed TrainerId to trainerId here
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!response.ok) {
                            throw new Error(`Error fetching trainer: ${response.status}`);
                        }

                        const trainerData = await response.json();
                        setTrainer(trainerData);
                    } catch (error) {
                        console.error("Error fetching trainer:", error);
                    }
                }
            };

            fetchTrainer();
        }, [props.trainerId]);  // Ensure to watch for changes in trainerId


        return (
            <table className="custom-event-editor">
                <tbody>
                <tr>
                    <td className="e-textlabel">Kategoria</td>
                    <td colSpan={4}>
                        <DropDownListComponent
                            id="Subject"
                            placeholder="Choose category"
                            data-name="Subject"
                            className="e-field"
                            dataSource={Object.keys(categories)}
                            value={props.Subject || null}
                        />
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">Godzina rozpoczęcia</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent
                            format="dd/MM/yyyy hh:mm a"
                            id="StartTime"
                            data-name="StartTime"
                            value={new Date(props.StartTime || props.startTime)}
                            className="e-field"
                        />
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">Godzina zakończenia</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent
                            format="dd/MM/yyyy hh:mm a"
                            id="EndTime"
                            data-name="EndTime"
                            value={new Date(props.EndTime || props.endTime)}
                            className="e-field"
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={5}>
                        <table className="exercises-table">
                            <thead>
                            <tr>
                                <th>Nazwa ćwiczenia</th>
                                <th>Serie</th>
                                <th>Powtórzenia</th>
                                <th>Waga ciężarów</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trainingExercises.length > 0 ? (
                                trainingExercises.map((exercise, index) => (
                                    <tr key={index}>
                                        <td>{exercise.name}</td>
                                        <td>{exercise.series}</td>
                                        <td>{exercise.repeatNumber}</td>
                                        <td>{exercise.weight}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Brak ćwiczeń</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </td>
                </tr>
                {/* Display Trainer's Name if available */}
                {trainer && (
                    <tr>
                        <td colSpan={4}>
                            <strong>Trener: {trainer.user.name} {trainer.user.surname}</strong>
                        </td>
                    </tr>
                )}
                </tbody>
                <tr>
                    <td colSpan={4} style={{textAlign: "center", marginTop: "10px"}}>
                        {isNewTraining ? (
                            <></>
                        ) : (
                            <>
                                <button onClick={() => handleEditTraining(props.id)} className="btn-edit">
                                    Edytuj
                                </button>
                                <button
                                    onClick={() => handleAddTrainer(props.id)}
                                    className="btn-add-trainer"
                                >
                                    {trainer ? "Zmień trenera" : "Dodaj trenera"}
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            </table>
        );
    };


    const eventSettings = {dataSource: trainings};

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1); // Adjust for your desired timezone
            const endTime = new Date(eventData.EndTime);
            endTime.setHours(endTime.getHours() + 1); // Adjust for your desired timezone

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const trainingData = {
                userUsername: jwtDecode(localStorage.getItem("token")).sub,
                category: eventData.Subject,
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            try {
                const token = localStorage.getItem("token");
                const response = await fetch('http://localhost:8080/training/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(trainingData)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const training = await response.json();
                navigate(`/training/${training.id}`);
                window.location.reload()
            } catch (error) {
                console.error("Saving event failed:", error);
            }
        } else if (args.requestType === 'eventChanged') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1); // Adjust for your desired timezone
            const endTime = new Date(eventData.EndTime);
            endTime.setHours(endTime.getHours() + 1); // Adjust for your desired timezone

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const trainingData = {
                id: eventData.id,
                userUsername: jwtDecode(localStorage.getItem("token")).sub,
                category: eventData.Subject,
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/training/update/${eventData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(trainingData)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                setTrainings((prevTrainings) => {
                    return prevTrainings.map((training) =>
                        training.id === eventData.id
                            ? {...training, StartTime: startTimeISO, EndTime: endTimeISO}
                            : training
                    );
                });

                window.location.reload();
            } catch (error) {
                console.error("Updating training failed:", error);
            }
        } else if (args.requestType === 'eventRemoved') {
            const eventData = args.data[0]; // Data of the training being deleted
            try {
                const token = localStorage.getItem("token");
                const response = await fetch('http://localhost:8080/training/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({id: eventData.id}) // Send the training ID in the body
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                setTrainings((prevTrainings) => prevTrainings.filter(training => training.id !== eventData.id));
                alert("Trening usunięty pomyślnie");

                window.location.reload();
            } catch (error) {
                console.error("Deleting training failed:", error);
                alert("Failed to delete the training.");
            }
        }
    };


    const handleEditTraining = (trainingId) => {
        navigate(`/training/${trainingId}`);
    }

    const handleAddTrainer = (trainingId) => {
        navigate(`/add-trainer-to-training/${trainingId}`);
    }

    L10n.load({
        'pl': {
            'schedule': {
                'saveButton': 'Zapisz',
                'cancelButton': 'Anuluj',
                'deleteButton': 'Usuń',
                'newEvent': 'Dodaj nowy trening',
                'editEvent': 'Edytuj trening',
                'deleteEvent': 'Usuń trening',
                'deleteContent': 'Czy na pewno chcesz usunąć ten trening?',
                'delete': 'Usuń',
                'cancel': 'Anuluj',
                'day': 'Dzień',
                'week': 'Tydzień',
                'month': 'Miesiąc',
                'today': 'Dziś',
            },
            'datetimepicker': {
                'placeholder': 'Wybierz datę',
                'today': 'Dziś'
            }
        }
    });

    return (
        <div className="all-schedules-container">
            <NavBar/>
            <div className="main-content">
                <div className="schedule-buttons">
                    <h1>Twoje treningi</h1> {/* Heading on the left */}
                    <div className="buttons-container"> {/* Buttons on the right */}
                        <CustomLink to="/all-training-schemas">Schematy treningów</CustomLink>
                        <CustomLink to="/own-exercises">Własne ćwiczenia</CustomLink>
                    </div>
                </div>
                <link href="https://cdn.syncfusion.com/ej2/material-dark.css" rel="stylesheet" id="material3-dark"/>
                <div className="scheduler-container">
                    <ScheduleComponent
                        firstDayOfWeek={1}
                        ref={scheduleObj}
                        width='100%'
                        height='100%'
                        currentView='Month'
                        eventSettings={eventSettings}
                        editorTemplate={editorTemplate}
                        showQuickInfo={false}
                        actionComplete={onActionComplete}
                        timeZone="Europe/Warsaw"
                        locale='pl'
                    >
                        <ViewsDirective>
                            <ViewDirective option='Day'></ViewDirective>
                            <ViewDirective option='Week'></ViewDirective>
                            <ViewDirective option='Month'></ViewDirective>
                        </ViewsDirective>
                        <Inject services={[Day, Week, Month]}/>
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    );
};

export default AllTrainingsPage;