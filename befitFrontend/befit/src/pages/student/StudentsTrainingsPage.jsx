import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "../../components/NavBar";
import {
    ScheduleComponent,
    Day,
    Week,
    Month,
    Inject,
    ViewsDirective,
    ViewDirective,
} from "@syncfusion/ej2-react-schedule";
import { L10n } from "@syncfusion/ej2-base";

const StudentsTrainingsPage = () => {
    const { studentUserName } = useParams(); // Get student ID from URL
    const [trainings, setTrainings] = useState([]);
    const [trainingExercisesMap, setTrainingExercisesMap] = useState({}); // Mapping trainingId to exercises
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

    // Custom editor template for training events
    const editorTemplate = (props) => {
        if (!props) return <div></div>;

        return (
            <table className="custom-event-editor">
                <tbody>
                <tr>
                    <td className="e-textlabel">Training</td>
                    <td colSpan={4}>
                        <span>{props.Subject}</span>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">From</td>
                    <td colSpan={4}>
                        <span>{new Date(props.StartTime).toLocaleString()}</span>
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
        );
    };

    const onPopupOpen = (args) => {
        let isEmptyCell =
            args.target.classList.contains('e-work-cells') ||
            args.target.classList.contains('e-header-cells'); // checking whether the cell is empty or not

        if (( args.type === 'Editor') && isEmptyCell) {
            args.cancel = true;
            args.element.querySelector(".e-footer-content").style.display = "none";
        }

        if (( args.type === 'Editor')) {
            args.cancel = false;
            args.element.querySelector(".e-footer-content").style.display = "none";
        }
    };

    L10n.load({
        'en-US': {
            'schedule': {
                'saveButton': '', // Remove Save button text
                'cancelButton': '', // Keep Cancel button text
                'deleteButton': '', // Remove Delete button text
                'newEvent': '',
                'editEvent': ''
            },
        }
    });

    const handleReturn = () => {
        navigate(`/details-student/${studentUserName}`);  // Use the username from the state
    };

    return (
        <div>
            <NavBar/>
            <h1>Treningi podopiecznego</h1>
            <ScheduleComponent
                width="100%"
                height="550px"
                currentView="Month"
                eventSettings={eventSettings}
                editorTemplate={editorTemplate}
                showQuickInfo={false}
                popupOpen={onPopupOpen}
                timeScale={{enable: true, interval: 60, slotCount: 1}}
                timezone="Europe/Warsaw"
            >
                <ViewsDirective>
                    <ViewDirective option="Day" readonly={true}/>
                    <ViewDirective option="Week" readonly={true}/>
                    <ViewDirective option="Month" readonly={false}/>
                </ViewsDirective>
                <Inject services={[Day, Week, Month]}/>
            </ScheduleComponent>
            <button onClick={handleReturn}>Powrót</button>

        </div>
    );
};

export default StudentsTrainingsPage;
