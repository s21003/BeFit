import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "../../components/NavBar";
import {ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective,} from "@syncfusion/ej2-react-schedule";
import {L10n, loadCldr, setCulture} from "@syncfusion/ej2-base";
import "../../styles/stundent/StudentsTrainingsPage.css"
import plNumberData from '@syncfusion/ej2-cldr-data/main/pl/numbers.json';
import pltimeZoneData from '@syncfusion/ej2-cldr-data/main/pl/timeZoneNames.json';
import plGregorian from '@syncfusion/ej2-cldr-data/main/pl/ca-gregorian.json';
import plNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import plWeekData from '@syncfusion/ej2-cldr-data/supplemental/weekData.json';

loadCldr(plNumberData, pltimeZoneData, plGregorian, plNumberingSystem, plWeekData);
setCulture('pl');

const StudentsTrainingsPage = () => {
    const { studentUserName } = useParams();
    const [trainings, setTrainings] = useState([]);
    const [trainingExercisesMap, setTrainingExercisesMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentTrainings = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/training/user/${studentUserName}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("API error:", errorText);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const mappedData = data.map((training) => ({
                        Id: training.id,
                        Subject: training.category,
                        StartTime: training.startTime,
                        EndTime: training.endTime,
                        trainingExerciseIds: training.trainingExerciseIds,
                        IsAllDay: false,
                    }));
                    setTrainings(mappedData);
                } catch (error) {
                    console.error("Fetching student trainings failed:", error);
                }
            } else {
                console.error("No token found, please login again.");
            }
        };

        fetchStudentTrainings();
    }, [studentUserName]);

    useEffect(() => {
        const fetchExercisesForTrainings = async () => {
            const token = localStorage.getItem("token");
            if (token && trainings.length > 0) {
                try {
                    const newTrainingExercisesMap = {};

                    for (const training of trainings) {
                        console.log("training: ",training)
                        const exercisesForTraining = [];

                        for (const exerciseId of training.trainingExerciseIds) {
                            console.log("exerciseId: ",exerciseId)
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
                            console.log("exercise: ",exercise)

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
                            const series = seriesData;
                            console.log("series: ",series)

                            exercisesForTraining.push({
                                exerciseId: exercise.id,
                                name: exercise.name,
                                series: series.series,
                                repeatNumber: series.repeatNumber,
                                weight: series.weight,
                            });
                        }
                        newTrainingExercisesMap[training.Id] = exercisesForTraining;
                    }
                    setTrainingExercisesMap(newTrainingExercisesMap);
                } catch (error) {
                    console.error("Fetching exercises for trainings failed:", error);
                }
            }
        };

        fetchExercisesForTrainings();
    }, [trainings]);

    const eventSettings = {
        dataSource: trainings,
        fields: {
            id: "Id",
            subject: { name: "Subject" },
            startTime: { name: "StartTime" },
            endTime: { name: "EndTime" },
        },
    };

    const editorTemplate = (props) => {
        if (!props) return <div></div>;

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

        return (
            <div className="custom-event-editor-wrapper">
                <table className="custom-event-editor">
                    <tbody>
                    <tr>
                        <td className="e-textlabel">Kategoria treningu</td>
                        <td colSpan={4}>
                            <span>{props.Subject}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Godzina rozpoczęcia</td>
                        <td colSpan={4}>
                            <span>{new Date(props.StartTime).toLocaleString()}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Godzina zakończenia</td>
                        <td colSpan={4}>
                            <span>{new Date(props.EndTime).toLocaleString()}</span>
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
                                {trainingExercisesMap[props.Id] ? (
                                    trainingExercisesMap[props.Id].map((exercise, index) => (
                                        <tr key={index}>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.series}</td>
                                            <td>{exercise.repeatNumber}</td>
                                            <td>{exercise.weight}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>No exercises available</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const onPopupOpen = (args) => {
        let isEmptyCell =
            args.target.classList.contains('e-work-cells') ||
            args.target.classList.contains('e-header-cells');

        if ((args.type === 'Editor') && isEmptyCell) {
            args.cancel = true;
            args.element.querySelector(".e-footer-content").style.display = "none";
        }

        if ((args.type === 'Editor')) {
            args.cancel = false;
            args.element.querySelector(".e-footer-content").style.display = "none";
        }
    };

    L10n.load({
        'pl': {
            'schedule': {
                'saveButton': '',
                'cancelButton': '',
                'deleteButton': '',
                'newEvent': '',
                'editEvent': 'Szczegóły treningu'
            },
        }
    });

    const handleReturn = () => {
        navigate(`/details-student/${studentUserName}`);
    };

    return (
        <div className="studentsTrainings-container">
            <NavBar/>
            <div className="studentsTrainings">
                <h1>Treningi podopiecznego</h1>
                <link href="https://cdn.syncfusion.com/ej2/material-dark.css" rel="stylesheet" id="material3-dark"/>
                <div className="studentsTrainings-scheduler-container">
                    <ScheduleComponent
                        firstDayOfWeek={1}
                        width="100%"
                        height="100%"
                        currentView="Month"
                        eventSettings={eventSettings}
                        editorTemplate={editorTemplate}
                        showQuickInfo={false}
                        popupOpen={onPopupOpen}
                        timeScale={{enable: true, interval: 60, slotCount: 1}}
                        timezone="Europe/Warsaw"
                        locale='pl'
                    >
                    <ViewsDirective>
                            <ViewDirective option="Day" readonly={true}/>
                            <ViewDirective option="Week" readonly={true}/>
                            <ViewDirective option="Month" readonly={false}/>
                        </ViewsDirective>
                        <Inject services={[Day, Week, Month]}/>
                    </ScheduleComponent>
                </div>
                <button className="studentsTrainings-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default StudentsTrainingsPage;
