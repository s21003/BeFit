import React, {useEffect, useState, useRef} from 'react';
import {ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective} from '@syncfusion/ej2-react-schedule';
import {useNavigate} from 'react-router-dom';
import NavBar from '../../components/NavBar';
import {jwtDecode} from 'jwt-decode';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {L10n} from '@syncfusion/ej2-base';
import '../../styles/scheduler/SchedulePage.css';

const AllMealsPage = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [mealProductsMap, setMealProductsMap] = useState({});
    const [currentView, setCurrentView] = useState('DAY'); // Track the current view
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Track the selected date
    const [dailyTotals, setDailyTotals] = useState({kcal: 0, protein: 0, fat: 0, carbs: 0}); // Track daily totals
    const scheduleObj = useRef(null);
    const [goals, setGoals] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    const labelMap = {
        Śniadanie: 'Sniadanie',
        'Drugie śniadanie': 'DrugieSniadanie',
        Obiad: 'Obiad',
        Przekąska: 'Przekaska',
        Kolacja: 'Kolacja',
    };

    const reverseLabelMap = Object.fromEntries(
        Object.entries(labelMap).map(([key, value]) => [value, key])
    );

    const getBackendLabel = (frontendLabel) => labelMap[frontendLabel] || frontendLabel;
    const getFrontendLabel = (backendLabel) => reverseLabelMap[backendLabel] || backendLabel;


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchGoals = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/goal/user/${username}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const goalsData = await response.json();
                setGoals(goalsData);
            } catch (error) {
                console.error("Fetching goals failed: ", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };

        fetchGoals();
    }, []);

    useEffect(() => {
        const fetchMeals = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = jwtDecode(token);
                const userUsername = decodedToken.sub;

                try {
                    const response = await fetch(`http://localhost:8080/meal/user/${userUsername}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();

                    const mappedData = data.map((meal) => ({
                        Id: meal.id,
                        Subject: getFrontendLabel(meal.label),
                        StartTime: meal.startTime,
                        EndTime: meal.endTime,
                        IsAllDay: false,
                        mealProductIds: meal.mealProductIds || [],
                    }));

                    setMeals(mappedData);
                } catch (error) {
                    console.error('Fetching meals failed: ', error);
                }
            } else {
                console.error('No token found, please login again.');
                navigate('/login');
            }
        };
        fetchMeals();
    }, [navigate]);

    useEffect(() => {
        const fetchProductsForMeals = async () => {
            const token = localStorage.getItem('token');
            if (token && meals.length > 0) {
                try {
                    const newMealProductsMap = {};

                    for (const meal of meals) {
                        const productsForMeal = [];
                        let totalKcal = 0;
                        let totalProtein = 0;
                        let totalFat = 0;
                        let totalCarbs = 0;

                        for (const productId of meal.mealProductIds) {
                            const productResponse = await fetch(
                                `http://localhost:8080/product/${productId.productId}`,
                                {
                                    method: 'GET',
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );

                            if (!productResponse.ok) {
                                const errorText = await productResponse.text();
                                console.error('API error:', errorText);
                                throw new Error(`HTTP error! status: ${productResponse.status}`);
                            }

                            const product = await productResponse.json();

                            const weightResponse = await fetch(
                                `http://localhost:8080/weights/${productId.weightsId}`,
                                {
                                    method: 'GET',
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );

                            if (!weightResponse.ok) {
                                const errorText = await weightResponse.text();
                                console.error('API error:', errorText);
                                throw new Error(`HTTP error! status: ${weightResponse.status}`);
                            }

                            const weightData = await weightResponse.json();
                            const weight = weightData.weight;

                            totalKcal += Math.round((product.kcal * weight) / 100);
                            totalProtein += Math.round((product.protein * weight) / 100);
                            totalFat += Math.round((product.fat * weight) / 100);
                            totalCarbs += Math.round((product.carbs * weight) / 100);

                            productsForMeal.push({
                                productId: product.id,
                                name: product.name,
                                kcal: Math.round((product.kcal * weight) / 100),
                                protein: Math.round((product.protein * weight) / 100),
                                fat: Math.round((product.fat * weight) / 100),
                                carbs: Math.round((product.carbs * weight) / 100),
                                weight: weight,
                            });
                        }

                        // Add total row
                        productsForMeal.push({
                            productId: 0,
                            name: 'Total',
                            kcal: totalKcal,
                            protein: totalProtein,
                            fat: totalFat,
                            carbs: totalCarbs,
                            weight: null,
                        });

                        newMealProductsMap[meal.Id] = productsForMeal;
                    }

                    setMealProductsMap(newMealProductsMap);
                } catch (error) {
                    console.error('Fetching products for meals failed:', error);
                }
            }
        };

        fetchProductsForMeals();
    }, [meals]);

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
        if (!props) {
            return <div>No props data available</div>;
        }

        const dialogWrapper = document.getElementById('_dialog_wrapper');

        if (dialogWrapper) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') { // Check if the style attribute changed
                        dialogWrapper.style.width = '80%'; // Set your desired width
                        dialogWrapper.style.maxWidth = '900px'; // Set your desired max width
                    }
                });
            });

            observer.observe(dialogWrapper, { attributes: true }); // Observe attribute changes

        } else {
            const waitForElement = setInterval(() => {
                const dialogWrapper = document.getElementById('_dialog_wrapper');
                if (dialogWrapper) {
                    clearInterval(waitForElement);
                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.attributeName === 'style') { // Check if the style attribute changed
                                dialogWrapper.style.width = '60%'; // Set your desired width
                                dialogWrapper.style.maxWidth = '900px'; // Set your desired max width
                            }
                        });
                    });

                    observer.observe(dialogWrapper, { attributes: true }); // Observe attribute changes
                }
            }, 100);
        }

        const [selectedLabel, setSelectedLabel] = useState(props.Subject || '');

        const handleLabelChange = (e) => {
            setSelectedLabel(e.value);
        };

        const isNewMeal = !props.Id;
        const mealProducts = mealProductsMap[props.Id] || [];
        const totalRow = mealProducts.find((product) => product.productId === 0);

        return (
            <div className="custom-event-editor-wrapper">
                <table className="custom-event-editor">
                    <thead>
                    <tr>
                        <td className="e-textlabel">Etykieta</td>
                        <td colSpan={4}>
                            <DropDownListComponent
                                id="Subject"
                                placeholder="Choose label"
                                data-name="Subject"
                                className="e-field"
                                dataSource={Object.keys(labelMap)}
                                value={selectedLabel}
                                change={handleLabelChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Godzina</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent
                                format="dd/MM/yy hh:mm a"
                                id="StartTime"
                                data-name="StartTime"
                                value={new Date(props.StartTime || props.startTime)}
                                className="e-field"
                            />
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan={5}>
                            <table className="editor-table">
                                <thead>
                                <tr>
                                    <th>Nazwa produktu</th>
                                    <th>Kalorie</th>
                                    <th>Białko</th>
                                    <th>Tłuszcze</th>
                                    <th>Węglowodany</th>
                                    <th>Waga</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mealProducts.length > 0 ? (
                                    mealProducts.map(
                                        (product, index) =>
                                            product.productId !== 0 && (
                                                <tr key={index}>
                                                    <td>{product.name}</td>
                                                    <td>{product.kcal}</td>
                                                    <td>{product.protein}</td>
                                                    <td>{product.fat}</td>
                                                    <td>{product.carbs}</td>
                                                    <td>{product.weight}</td>
                                                </tr>
                                            )
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan={6}>Brak produktów</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    {totalRow && (
                        <tr className="editor-total-row">
                            <td>Łącznie:</td>
                            <td>
                                <strong>Kalorie:</strong> {totalRow.kcal}
                            </td>
                            <td>
                                <strong>Białko:</strong> {totalRow.protein}
                            </td>
                            <td>
                                <strong>Tłuszcze:</strong> {totalRow.fat}
                            </td>
                            <td>
                                <strong>Węglowodany:</strong> {totalRow.carbs}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    {isNewMeal ? (
                        <></>
                    ) : (
                        <div className="e-footer-content">
                            <button className="e-schedule-dialog e-control e-btn e-lib e-event-edit e-flat" onClick={() => handleEditMeal(props.Id)}>Edytuj</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (currentView === 'DAY') {

            const selectedDateObj = new Date(selectedDate); // Create Date object from selectedDate
            selectedDateObj.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

            const selectedDateMeals = meals.filter((meal) => {
                const mealDateObj = new Date(meal.StartTime); // Create Date object from meal.StartTime
                mealDateObj.setHours(0, 0, 0, 0); // Set time to midnight

                return mealDateObj.getTime() === selectedDateObj.getTime(); // Compare using getTime()
            });

            let totalKcal = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarbs = 0;

            selectedDateMeals.forEach((meal) => {
                const mealProducts = mealProductsMap[meal.Id] || [];
                const totalRow = mealProducts.find((product) => product.productId === 0);
                if (totalRow) {
                    totalKcal += totalRow.kcal;
                    totalProtein += totalRow.protein;
                    totalFat += totalRow.fat;
                    totalCarbs += totalRow.carbs;
                }
            });

            setDailyTotals({kcal: totalKcal, protein: totalProtein, fat: totalFat, carbs: totalCarbs});
        }
    }, [meals, mealProductsMap, currentView, selectedDate]);

    const onActionComplete = async (args) => {
        if (args.requestType === 'dateNavigate') {
            const selectedDate = new Date(scheduleObj.current.selectedDate);
            setSelectedDate(selectedDate); // Update the selected date
        } else if (args.requestType === 'viewNavigate' || args.requestType === 'viewChange') {
            const currentView = scheduleObj.current.currentView;
            setCurrentView(currentView.toUpperCase()); // Update the current view state


            if (currentView === 'Day' && args.data && args.data.selectedDate) {
                const selectedDate = new Date(args.data.selectedDate);
                setSelectedDate(selectedDate); // Update the selected date
            }
        } else if (args.requestType === 'eventCreated') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.StartTime);
            endTime.setHours(startTime.getHours() + 1);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const mealData = {
                userUsername: jwtDecode(localStorage.getItem('token')).sub,
                label: getBackendLabel(eventData.Subject),
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/meal/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(mealData),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const meal = await response.json();
                navigate(`/meal/${meal.id}`);
                window.location.reload();
            } catch (error) {
                console.error('Saving event failed:', error);
            }
        } else if (args.requestType === 'eventChanged') {
            const eventData = args.data[0];
            const startTime = new Date(eventData.StartTime);
            startTime.setHours(startTime.getHours() + 1);
            const endTime = new Date(eventData.StartTime);
            endTime.setHours(startTime.getHours() + 1);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();

            const mealData = {
                userUsername: jwtDecode(localStorage.getItem('token')).sub,
                label: getBackendLabel(eventData.Subject),
                startTime: startTimeISO,
                endTime: endTimeISO,
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/meal/updateMealData/${eventData.Id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(mealData),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                setMeals((prevMeals) => {
                    return prevMeals.map((meal) =>
                        meal.Id === eventData.id
                            ? {...meal, StartTime: startTimeISO, EndTime: endTimeISO}
                            : meal
                    );
                });

                window.location.reload();
            } catch (error) {
                console.error('Updating meal failed:', error);
            }
        } else if (args.requestType === 'eventRemoved') {
            const eventData = args.data[0];
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/meal/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({id: eventData.Id}),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                setMeals((prevMeals) => prevMeals.filter((meal) => meal.Id !== eventData.Id));
                alert('Posiłek usunięty pomyślnie');
                window.location.reload();
            } catch (error) {
                console.error('Deleting meal failed:', error);
                alert('Failed to delete the meal.');
            }
        }
    };

    const handleEditMeal = (mealId) => {
        navigate(`/meal/${mealId}`);
    };

    L10n.load({
        pl: {
            schedule: {
                saveButton: 'Zapisz',
                cancelButton: 'Anuluj',
                deleteButton: 'Usuń',
                newEvent: 'Dodaj nowy posiłek',
                editEvent: 'Edytuj posiłek',
                deleteEvent: 'Usuń posiłek',
                deleteContent: 'Czy na pewno chcesz usunąć ten posiłek?',
                delete: 'Usuń',
                cancel: 'Anuluj',
                day: 'Dzień',
                week: 'Tydzień',
                month: 'Miesiąc',
                today: 'Dziś',
            },
            datetimepicker: {
                placeholder: 'Wybierz datę',
                today: 'Dziś',
            },
        },
    });

    const eventSettings = {dataSource: meals};

    const timeScale = {enable: true, interval: 60, slotCount: 1};


    const handleSchemas = () => {
        navigate(`/all-meal-schemas`)
    }

    const handleOwnProducts = () => {
        navigate(`/own-products`);
    }

    return (
        <div className="all-schedules-container">
            <NavBar/>
            <div className="all-schedules">
                <div className="schedule-btns">
                    <h2>Twoje posiłki</h2>
                    <div className="schedule-buttons-container">
                        <button className="schedule-btn" onClick={handleSchemas}>Schematy posiłków</button>
                        <button className="schedule-btn" onClick={handleOwnProducts}>Własne produkty</button>
                    </div>
                </div>
                <link
                    href="https://cdn.syncfusion.com/ej2/material-dark.css"
                    rel="stylesheet"
                    id="material3-dark"
                />
                <div className="scheduler-container">
                    <ScheduleComponent
                        ref={scheduleObj}
                        width="100%"
                        height={currentView === 'DAY' ? '100%' : '100%'}
                        currentView={currentView}
                        eventSettings={eventSettings}
                        editorTemplate={editorTemplate}
                        showQuickInfo={false}
                        popupOpen={onPopupOpen}
                        timeScale={timeScale}
                        actionComplete={onActionComplete}
                    >
                        <ViewsDirective>
                            <ViewDirective option="Day"/>
                            <ViewDirective option="Week"/>
                            <ViewDirective option="Month"/>
                        </ViewsDirective>
                        <Inject services={[Day, Week, Month]}/>
                    </ScheduleComponent>
                    {currentView === 'DAY' && (
                        <div className="editor-daily-totals">
                            <h3>Podsumowanie dnia: {new Date(selectedDate).toLocaleDateString('pl-PL')}</h3>
                            {isLoading ? (
                                <p>Ładowanie danych...</p>
                            ) : (
                                <>
                                    <p>Kalorie: {dailyTotals.kcal} / {goals?.plannedDailyKcal ?? 0}</p>
                                    <p>Białko: {dailyTotals.protein} / {goals?.plannedDailyProteins ?? 0}</p>
                                    <p>Tłuszcze: {dailyTotals.fat} / {goals?.plannedDailyFats ?? 0}</p>
                                    <p>Węglowodany: {dailyTotals.carbs} / {goals?.plannedDailyCarbs ?? 0}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllMealsPage;