import React, { useEffect, useState, useRef } from 'react';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/MainPage.css"
import { CustomLink } from "../../helpers/CustomLink";

const AllTrainingsPage = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const scheduleObj = useRef(null);

    useEffect(() => {
        const fetchTrainings = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const userUsername = decodedToken.sub;

                console.log("User username from token:", userUsername, "   ", token);

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
                        Id: training.id,
                        Subject: training.category,
                        StartTime: training.startTime,
                        EndTime: training.endTime,
                        IsAllDay: false
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

    let popupData;

    const onPopupOpen = (args) => {
        if (args.type === 'Editor') {
            let statusElement = args.element.querySelector('#EventType');
            if (statusElement) {
                statusElement.setAttribute('name', 'EventType');
            }
            console.log("status element: ",statusElement);
            popupData = args.data;
        }
    };

    const editorTemplate = (props) => {
        console.log("props editorTemlate: ",props);
        return (props !== undefined ? (
            <table className="custom-event-editor">
                <tbody>
                <tr>
                    <td className="e-textlabel">Category</td>
                    <td colSpan={4}>
                        <DropDownListComponent id="Subject" placeholder='Choose category' data-name="Subject" className="e-field" dataSource={['Cardio', 'Silowy', 'Crossfit', 'Fitness', 'Grupowy']} value={props.Subject || null}></DropDownListComponent>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">From</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
                                                 value={new Date(props.StartTime || props.startTime)}
                                                 className="e-field"></DateTimePickerComponent>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">To</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime"
                                                 value={new Date(props.EndTime || props.endTime)}
                                                 className="e-field"></DateTimePickerComponent>
                    </td>
                </tr>
                </tbody>
                <CustomLink to={`/training/${props.Id}`}>Edytuj</CustomLink>
            </table>

        ) : <div></div>);
    };

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            const eventData = args.data[0];
            console.log("eventData: ", eventData);
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.EndTime);
            endTime.setHours(endTime.getHours() + 1);

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
            } catch (error) {
                console.error("Saving event failed:", error);
            }
        }
    };

    const eventSettings = { dataSource: trainings }

    return (
        <>
            <NavBar />
            <div className="training-buttons">
                <h1>Treningi</h1>
                <CustomLink to="/all-training-schemas"> Schematy trenigów</CustomLink>
                <CustomLink to="/exercises">Własne ćwiczenia</CustomLink>
            </div>
            <div>
                <ScheduleComponent
                    ref={scheduleObj}
                    width='100%'
                    height='550px'
                    currentView='Month'
                    eventSettings={eventSettings}
                    editorTemplate={editorTemplate}
                    showQuickInfo={false}
                    popupOpen={onPopupOpen}
                    actionComplete={onActionComplete}
                    timeZone="Europe/Warsaw"
                >
                    <ViewsDirective>
                        <ViewDirective option='Day'></ViewDirective>
                        <ViewDirective option='Week'></ViewDirective>
                        <ViewDirective option='Month'></ViewDirective>
                    </ViewsDirective>
                    <Inject services={[Day, Week, Month]} />
                </ScheduleComponent>
            </div>
        </>
    )
};

export default AllTrainingsPage;
