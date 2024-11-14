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
                const userEmail = decodedToken.sub;

                console.log("User Email from token:", userEmail, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/training/user/${userEmail}`, {
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

                    const formatDate = date => {
                        const localDate = new Date(date);
                        // Get the local time zone offset and convert it to milliseconds
                        const offset = localDate.getTimezoneOffset() * 60 * 1000;
                        // Convert UTC time to local time
                        const localTime = localDate.getTime() - offset;
                        // Create a new Date object with local time
                        const localDateTime = new Date(localTime);
                        // Extract date components
                        const year = localDateTime.getFullYear();
                        const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
                        const day = String(localDateTime.getDate()).padStart(2, '0');
                        // Extract time components
                        const hours = String(localDateTime.getHours()).padStart(2, '0');
                        const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
                        const seconds = String(localDateTime.getSeconds()).padStart(2, '0');
                        // Format the date and time
                        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                        return formattedDateTime;
                    };

                    const mappedData = data.map(training => ({
                        Id: training.id,
                        Subject: training.category,
                        StartTime: formatDate(new Date(training.startTime)),
                        EndTime: formatDate(new Date(training.endTime)),
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

    const eventSettings = { dataSource: trainings }

    let popupData;

    const onPopupOpen = (args) => {
        if (args.type === 'Editor') {
            let statusElement = args.element.querySelector('#EventType');
            if (statusElement) {
                statusElement.setAttribute('name', 'EventType');
            }
            popupData = args.data;
        }
    };

    const editorTemplate = (props) => {
        return (props !== undefined ? (
            <table className="custom-event-editor">
                <tbody>
                <tr>
                    <td className="e-textlabel">Category</td>
                    <td colSpan={4}>
                        <DropDownListComponent id="Category" placeholder='Choose category' data-name="Category" className="e-field" dataSource={['Cardio', 'Silowy', 'Crossfit', 'Fitness', 'Grupowy']} value={props.Category || null}></DropDownListComponent>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">From</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.StartTime || props.startTime)} className="e-field"></DateTimePickerComponent>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">To</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.EndTime || props.endTime)} className="e-field"></DateTimePickerComponent>
                    </td>
                </tr>
                </tbody>
            </table>
        ) : <div></div>);
    };

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            const eventData = args.data[0]; // Syncfusion may send the data as an array
            console.log("Event Data:", eventData);

            const trainingData = {
                userEmail: jwtDecode(localStorage.getItem("token")).sub,  // Decode the token to get the user email
                category: eventData.Category,
                startTime: eventData.StartTime,
                endTime: eventData.EndTime
            };

            console.log("trainigData: ", trainingData);

            console.log("start time: ", eventData.StartTime);
            console.log("end time: ", eventData.EndTime);

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

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const savedEvent = await response.json();
                console.log("Saved Event:", savedEvent);

                // Add the saved event to the state
                setTrainings(prevTrainings => [...prevTrainings, {
                    Id: savedEvent.id,
                    Subject: savedEvent.category,
                    StartTime: new Date(savedEvent.startTime),
                    EndTime: new Date(savedEvent.endTime),
                    IsAllDay: false
                }]);
            } catch (error) {
                console.error("Saving event failed:", error);
            }
        }
    };

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
                    editorTemplate={editorTemplate.bind(this)}
                    showQuickInfo={false}
                    popupOpen={onPopupOpen.bind(this)}
                    actionComplete={onActionComplete.bind(this)}
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
