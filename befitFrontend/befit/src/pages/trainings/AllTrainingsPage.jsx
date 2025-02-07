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
import {L10n, loadCldr, setCulture} from "@syncfusion/ej2-base";
import "../../styles/scheduler/SchedulePage.css"
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
    const scheduleObj = useRef(null);
    const [role, setRole] = useState("");

    const categories = {
        "Cardio": "Cardio",
        "Siłowy": "Silowy",
        "Crossfit": "Crossfit",
        "Fitness": "Fitness",
        "Grupowy": "Grupowy"
    };

    const reverseCategories = Object.fromEntries(
        Object.entries(categories).map(([key, value]) => [value, key])
    );

    const getBackendCategory = (frontendCategory) => categories[frontendCategory] || frontendCategory;
    const getFrontendCategory = (backendCategory) => reverseCategories[backendCategory] || backendCategory;

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
                        Subject: getFrontendCategory(training.category),
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

        const dialogWrapper = document.getElementById('_dialog_wrapper');

        if (dialogWrapper) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') {
                        dialogWrapper.style.width = '60%';
                        dialogWrapper.style.maxWidth = '700px';
                    }
                });
            });

            observer.observe(dialogWrapper, { attributes: true });

        } else {
            const waitForElement = setInterval(() => {
                const dialogWrapper = document.getElementById('_dialog_wrapper');
                if (dialogWrapper) {
                    clearInterval(waitForElement);
                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.attributeName === 'style') {
                                dialogWrapper.style.width = '60%';
                                dialogWrapper.style.maxWidth = '600px';
                            }
                        });
                    });

                    observer.observe(dialogWrapper, { attributes: true });
                }
            }, 100);
        }

        const isNewTraining = !props.id;
        const trainingExercises = trainingExercisesMap[props.id] || [];

        const [trainer, setTrainer] = useState(null);

        useEffect(() => {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.ROLE[0].authority);

            const fetchTrainer = async () => {
                if (props.trainerId) {
                    try {
                        const response = await fetch(`http://localhost:8080/trainer/${props.trainerId}`, {
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
        }, [props.trainerId]);

        const [selectedCategory, setSelectedCategory] = useState(props.Subject || '');

        const handleCategoryChange = (e) => {
            setSelectedCategory(e.value);
        };

        let initialStartTime = props.StartTime ? new Date(props.StartTime) : null;
        let initialEndTime = props.EndTime ? new Date(props.EndTime) : null;

        if (isNewTraining) {
            if (initialStartTime) {
                initialStartTime.setHours(8, 0, 0, 0);

                initialEndTime = new Date(initialStartTime);
                initialEndTime.setHours(10, 0, 0, 0);
            } else {
                const today = new Date();
                today.setHours(8, 0, 0, 0);
                initialStartTime = today;

                const endTime = new Date(today);
                endTime.setHours(10, 0, 0, 0);
                initialEndTime = endTime;
            }
        }

        const [startTime, setStartTime] = useState(initialStartTime);
        const [endTime, setEndTime] = useState(initialEndTime);

        const handleStartTimeChange = (e) => {
            setStartTime(e.value);
        };

        const handleEndTimeChange = (e) => {
            setEndTime(e.value);
        };

        const isTrainer = role === "TRAINER";


        return (
            <div className="custom-event-editor-wrapper">
                <table className="custom-event-editor">
                    <thead>
                    <tr>
                        <td className="e-textlabel">Kategoria</td>
                        <td colSpan={4}>
                            <DropDownListComponent
                                id="Subject"
                                placeholder="Choose category"
                                data-name="Subject"
                                className="e-field"
                                dataSource={Object.keys(categories)}
                                value={selectedCategory}
                                change={handleCategoryChange}
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
                                value={startTime}
                                change={handleStartTimeChange}
                                className="e-field"
                            />
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="e-textlabel">Godzina zakończenia</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent
                                format="dd/MM/yyyy hh:mm a"
                                id="EndTime"
                                data-name="EndTime"
                                value={endTime}
                                change={handleEndTimeChange}
                                className="e-field"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <table className="editor-table">
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
                    {trainer && (
                        <tr>
                            <td colSpan={4}>
                                <strong>Trener: {trainer.user.name} {trainer.user.surname}</strong>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    {isNewTraining ? (
                        <></>
                    ) : (
                        <div className="e-footer-content">
                            <button onClick={() => handleEditTraining(props.id)}
                                    className="e-schedule-dialog e-control e-btn e-lib e-event-edit e-flat btn-edit">Edytuj
                            </button>
                            {!isTrainer ? (
                                <button onClick={() => handleAddTrainer(props.id)}
                                        className="e-schedule-dialog e-control e-btn e-lib e-event-edit e-flat btn-edit">{trainer ? "Zmień trenera" : "Dodaj trenera"}</button>
                            ) : (<></>)}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    const eventSettings = {dataSource: trainings};

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.EndTime);
            endTime.setHours(endTime.getHours() + 1);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const trainingData = {
                userUsername: jwtDecode(localStorage.getItem("token")).sub,
                category: getBackendCategory(eventData.Subject),
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            console.log("trainingData: ", trainingData);

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
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.EndTime);
            endTime.setHours(endTime.getHours() + 1);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const trainingData = {
                id: eventData.id,
                userUsername: jwtDecode(localStorage.getItem("token")).sub,
                category: getBackendCategory(eventData.Subject),
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
            const eventData = args.data[0];
            try {
                const token = localStorage.getItem("token");
                const response = await fetch('http://localhost:8080/training/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({id: eventData.id})
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
            datetimepicker: {
                placeholder: 'Wybierz datę',
                today: 'Dziś'
            }
        }
    });

    const handleSchemas = () => {
        navigate(`/all-training-schemas`)
    }

    const handleOwnExercises = () => {
        navigate(`/own-exercises`);
    }

    return (
        <div className="all-schedules-container">
            <NavBar/>
            <div className="all-schedules">
                <div className="schedule-btns">
                    <h2>Twoje treningi</h2>
                    <div className="schedule-buttons-container">
                        <button className="schedule-btn" onClick={handleSchemas}>Schematy treningów</button>
                        <button className="schedule-btn" onClick={handleOwnExercises}>Własne ćwiczenia</button>
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