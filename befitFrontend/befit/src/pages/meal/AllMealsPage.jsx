import React, { useEffect, useState, useRef } from 'react';
import {
    ScheduleComponent,
    Day,
    Week,
    Month,
    Inject,
    ViewsDirective,
    ViewDirective
} from '@syncfusion/ej2-react-schedule';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/MainPage.css";
import { CustomLink } from "../../helpers/CustomLink";
import { jwtDecode } from "jwt-decode";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import {DropDownListComponent} from "@syncfusion/ej2-react-dropdowns";

const AllMealsPage = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const scheduleObj = useRef(null);

    useEffect(() => {
        const fetchMeals = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const userUsername = decodedToken.sub;

                try {
                    const response = await fetch(`http://localhost:8080/meal/user/${userUsername}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();

                    const mappedData = data.map(meal => ({
                        Id: meal.id,
                        Subject: meal.label,
                        StartTime: meal.startTime,
                        EndTime: meal.endTime,
                        IsAllDay: false,
                    }));

                    setMeals(mappedData);
                } catch (error) {
                    console.error("Fetching meals failed: ", error);
                }
            } else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchMeals();
    }, [navigate]);

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
                    <td className="e-textlabel">Name</td>
                    <td colSpan={4}>
                        <DropDownListComponent id="label" placeholder='Choose label' data-name="label"
                                               className="e-field"
                                               dataSource={['Sniadanie', 'DrugieSniadanie', 'Obiad', 'Przekaska', 'Kolacja']}
                                               value={props.label || null}></DropDownListComponent>
                    </td>
                </tr>
                <tr>
                    <td className="e-textlabel">From</td>
                    <td colSpan={4}>
                        <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime"
                                                 value={new Date(props.StartTime || props.StartTime)}
                                                 className="e-field"></DateTimePickerComponent>
                    </td>
                </tr>
                </tbody>
                <CustomLink to={`/meal/${props.Id}`}>Edytuj</CustomLink>
            </table>
        ) : <div></div>);
};

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.StartTime);
            endTime.setHours(startTime.getHours() + 1);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const mealData = {
                userUsername: jwtDecode(localStorage.getItem("token")).sub,
                label: eventData.label,
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            try {
                const token = localStorage.getItem("token");
                const response = await fetch('http://localhost:8080/meal/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(mealData)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const savedEvent = await response.json();
                setMeals(prevMeals => [...prevMeals, {
                    Id: savedEvent.id,
                    Subject: savedEvent.label,
                    StartTime: savedEvent.startTime,
                    EndTime: savedEvent.endTime,
                    IsAllDay: false
                }]);
            } catch (error) {
                console.error("Saving event failed:", error);
            }
        }
        console.log("meals after add: ",meals)
    };

    const eventSettings = { dataSource: meals }

    const timeScale = { enable: true, interval: 60, slotCount: 1 };

    return (
        <>
            <NavBar />
            <div className="meal-buttons">
                <h1>Posiłki</h1>
                <CustomLink to="/all-meal-schemas">Schematy posiłków</CustomLink>
                <CustomLink to="/own-products">Własne produkty</CustomLink>
            </div>
            <div>
                <ScheduleComponent
                    ref={scheduleObj}
                    width="100%"
                    height="550px"
                    currentView="DAY"
                    eventSettings={eventSettings}
                    editorTemplate={editorTemplate}
                    showQuickInfo={false}
                    popupOpen={onPopupOpen.bind(this)}
                    timeScale={timeScale}
                    actionComplete={onActionComplete.bind(this)}
                    timeZone="Europe/Warsaw"
                >
                    <ViewsDirective>
                        <ViewDirective option="Day" />
                        <ViewDirective option="Week" />
                        <ViewDirective option="Month" />
                    </ViewsDirective>
                    <Inject services={[Day, Week, Month]} />
                </ScheduleComponent>
            </div>
        </>
    );
};

export default AllMealsPage;
