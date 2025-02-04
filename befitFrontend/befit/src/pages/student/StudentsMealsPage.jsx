import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "../../components/NavBar";
import {
    ScheduleComponent,
    Month,
    Inject,
    ViewsDirective,
    ViewDirective, Day, Week,
} from "@syncfusion/ej2-react-schedule";
import {L10n, setCulture} from "@syncfusion/ej2-base";
import "../../styles/stundent/StudentsMealsPage.css"
import {jwtDecode} from "jwt-decode";
setCulture('pl')

const StudentsMealsPage = () => {
    const { studentUserName } = useParams(); // Get student's username from URL
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [mealProductsMap, setMealProductsMap] = useState({});
    const [currentView, setCurrentView] = useState('DAY'); // Track the current view
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Track the selected date
    const [dailyTotals, setDailyTotals] = useState({kcal: 0, protein: 0, fat: 0, carbs: 0}); // Track daily totals
    const scheduleObj = useRef(null);
    const [goals, setGoals] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [studentData, setStudentData] = useState([]);

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

    const getFrontendLabel = (backendLabel) => reverseLabelMap[backendLabel] || backendLabel;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchStudentData = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/user/${studentUserName}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const student = await response.json();
                console.log("student: ",student)
                setStudentData(student);
            } catch (error) {
                console.error("Fetching goals failed: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchGoals = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/goal/user/${studentUserName}`, {
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
        const fetchStudentMeals = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/meal/user/${studentUserName}`, // Use studentUserName
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
                    const mappedData = data.map((meal) => ({
                        Id: meal.id,
                        Subject: getFrontendLabel(meal.label), // Keep the original label for now
                        StartTime: meal.startTime,
                        EndTime: meal.endTime,
                        mealProductIds: meal.mealProductIds,
                        IsAllDay: false,
                    }));
                    setMeals(mappedData);
                } catch (error) {
                    console.error("Fetching student meals failed:", error);
                } finally {
                    setIsLoading(false); // Set loading to false after data is fetched
                }
            } else {
                console.error("No token found, please login again.");
            }
        };

        fetchStudentMeals();
    }, [studentUserName]); // Add studentUserName to dependency array

    useEffect(() => {
        const fetchProductsForMeals = async () => {
            const token = localStorage.getItem("token");
            if (token && meals.length > 0) {
                try {
                    const newMealProductsMap = {};
                    let productsForMeal;
                    let totalKcal;
                    let totalProtein;
                    let totalFat;
                    let totalCarbs;

                    for (const meal of meals) {
                        productsForMeal = [];
                        totalKcal = 0;
                        totalProtein = 0;
                        totalFat = 0;
                        totalCarbs = 0;

                        for (const productId of meal.mealProductIds) {
                            const productResponse = await fetch(
                                `http://localhost:8080/product/${productId.productId}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!productResponse.ok) {
                                const errorText = await productResponse.text();
                                console.error("API error:", errorText);
                                throw new Error(`HTTP error! status: ${productResponse.status}`);
                            }

                            const product = await productResponse.json();

                            const weightResponse = await fetch(
                                `http://localhost:8080/weights/${productId.weightsId}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!weightResponse.ok) {
                                const errorText = await weightResponse.text();
                                console.error("API error:", errorText);
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
                    console.error("Fetching products for meals failed:", error);
                }
            }
        };

        fetchProductsForMeals();
    }, [meals]);

    const eventSettings = {
        dataSource: meals,
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
                    if (mutation.attributeName === 'style') { // Check if the style attribute changed
                        dialogWrapper.style.width = '60%'; // Set your desired width
                        dialogWrapper.style.maxWidth = '700px'; // Set your desired max width
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
                                dialogWrapper.style.maxWidth = '600px'; // Set your desired max width
                            }
                        });
                    });

                    observer.observe(dialogWrapper, { attributes: true }); // Observe attribute changes
                }
            }, 100);
        }


        const mealProducts = mealProductsMap[props.Id] || [];
        const totalRow = mealProducts.find(product => product.productId === 0); // Get the total row from the map

        return (
            <div className="custom-event-editor-wrapper">
                <table className="custom-event-editor">
                    <thead>
                    <tr>
                        <td className="e-textlabel">Etykieta</td>
                        <td colSpan={4}>
                            <span>{props.Subject}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Godzina</td>
                        <td colSpan={4}>
                            <span>{new Date(props.StartTime).toLocaleString()}</span>
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
                            <td><strong>Kalorie:</strong> {totalRow.kcal}</td>
                            <td><strong>Białko:</strong> {totalRow.protein}</td>
                            <td><strong>Tłuszcze:</strong> {totalRow.fat}</td>
                            <td><strong>Węglowodany:</strong> {totalRow.carbs}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    };

    const onPopupOpen = (args) => {
        let isEmptyCell =
            args.target.classList.contains('e-work-cells') ||
            args.target.classList.contains('e-header-cells'); // checking whether the cell is empty or not

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
        pl: {
            schedule: {
                saveButton: '',
                cancelButton: '',
                deleteButton: '',
                newEvent: '',
                editEvent: 'Szczegóły posiłku',
                day: 'Dzień',
                week: 'Tydzień',
                month: 'Miesiąc',
                today: 'Dziś',
            },
        }
    });

    useEffect(() => {
        console.log('useEffect for daily totals triggered');
        if (currentView === 'DAY') {
            console.log('Filtering meals for selected date:', selectedDate);

            const selectedDateObj = new Date(selectedDate); // Create Date object from selectedDate
            selectedDateObj.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

            const selectedDateMeals = meals.filter((meal) => {
                const mealDateObj = new Date(meal.StartTime); // Create Date object from meal.StartTime
                mealDateObj.setHours(0, 0, 0, 0); // Set time to midnight

                console.log('Meal date:', mealDateObj, 'Selected date:', selectedDateObj);
                return mealDateObj.getTime() === selectedDateObj.getTime(); // Compare using getTime()
            });

            console.log('Selected date meals:', selectedDateMeals);

            let totalKcal = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarbs = 0;

            selectedDateMeals.forEach((meal) => {
                const mealProducts = mealProductsMap[meal.Id] || [];
                console.log('Meal products for meal ID', meal.Id, ':', mealProducts); // Debugging: Log the meal products
                const totalRow = mealProducts.find((product) => product.productId === 0);
                if (totalRow) {
                    totalKcal += totalRow.kcal;
                    totalProtein += totalRow.protein;
                    totalFat += totalRow.fat;
                    totalCarbs += totalRow.carbs;
                }
            });

            console.log('Calculated daily totals:', {
                kcal: totalKcal,
                protein: totalProtein,
                fat: totalFat,
                carbs: totalCarbs
            });
            setDailyTotals({kcal: totalKcal, protein: totalProtein, fat: totalFat, carbs: totalCarbs});
        }
    }, [meals, mealProductsMap, currentView, selectedDate]);

    const handleReturn = () => {
        navigate(`/details-student/${studentUserName}`);
    };

    const onActionComplete = async (args) => {
        console.log('onActionComplete triggered:', args); // Debugging: Log the entire args object

        if (args.requestType === 'dateNavigate') {
            const selectedDate = new Date(scheduleObj.current.selectedDate);
            setSelectedDate(selectedDate); // Update the selected date
        } else if (args.requestType === 'viewNavigate' || args.requestType === 'viewChange') {
            const currentView = scheduleObj.current.currentView;
            setCurrentView(currentView.toUpperCase()); // Update the current view state

            if (currentView === 'Day' && args.data && args.data.selectedDate) {
                const selectedDate = new Date(args.data.selectedDate);
                console.log('Selected date updated:', selectedDate); // Debugging: Log the selected date
                setSelectedDate(selectedDate); // Update the selected date
            }
        }
    }

    console.log('Current view:', currentView, 'Height:', currentView === 'DAY' ? '90%' : '100%');


    return (
        <div className="studentsMeals-container">
            <NavBar />
            <div className="studentsMeals">
                <h1>Posiłki podopiecznego {studentData.name} {studentData.surname}</h1> {/* Display student's username */}

                <link href="https://cdn.syncfusion.com/ej2/material-dark.css" rel="stylesheet" id="material3-dark"/>
                {isLoading ? (
                    <p>Loading meals...</p>
                ) : (
                    <div className="studentsMeals-scheduler-container">
                        <ScheduleComponent
                            ref={scheduleObj}
                            firstDayOfWeek={1}
                            width="100%"
                            height={currentView === 'Day' ? '100%' : '100%'} // Adjust height for Day view
                            currentView={currentView}
                            eventSettings={eventSettings}
                            editorTemplate={editorTemplate}
                            showQuickInfo={false}
                            popupOpen={onPopupOpen}
                            timeScale={{ enable: true, interval: 60, slotCount: 1 }}
                            actionComplete={onActionComplete}
                        >
                            <ViewsDirective>
                                <ViewDirective option="Day" />
                                <ViewDirective option="Week" />
                                <ViewDirective option="Month" />
                            </ViewsDirective>
                            <Inject services={[Day, Week, Month]} />
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
                )}
                <button className="studentsMeals-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default StudentsMealsPage;
