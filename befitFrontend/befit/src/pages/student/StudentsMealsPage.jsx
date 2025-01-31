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

const StudentsMealsPage = () => {
    const { studentUserName } = useParams(); // Get student ID from URL
    const [meals, setMeals] = useState([]);
    const [mealProductsMap, setMealProductsMap] = useState({}); // Mapping mealId to products
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentMeals = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/meal/user/${studentUserName}`,
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
                        Subject: meal.label,
                        StartTime: meal.startTime,
                        EndTime: meal.endTime,
                        mealProductIds: meal.mealProductIds,
                        IsAllDay: false,
                    }));
                    setMeals(mappedData);
                } catch (error) {
                    console.error("Fetching student meals failed:", error);
                }
            } else {
                console.error("No token found, please login again.");
            }
        };

        fetchStudentMeals();
    }, [studentUserName]);

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

        const mealProducts = mealProductsMap[props.Id] || [];
        const totalRow = mealProducts.find(product => product.productId === 0); // Get the total row from the map

        return (
            <table className="custom-event-editor">
                <tbody>
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
                <tr>
                    <td colSpan={5}>
                        <table className="products-table">
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
                                mealProducts.map((product, index) => (
                                    product.productId !== 0 ? ( // Skip the total row in product list
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.kcal}</td>
                                            <td>{product.protein}</td>
                                            <td>{product.fat}</td>
                                            <td>{product.carbs}</td>
                                            <td>{product.weight}</td>
                                        </tr>
                                    ) : null
                                ))
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
                    <tr>
                        <td><strong>Kalorie:</strong> {totalRow.kcal}</td>  {/* Label for Total kcal */}
                        <td><strong>Białko:</strong> {totalRow.protein}</td>  {/* Label for Total Protein */}
                        <td><strong>Tłuszcze:</strong> {totalRow.fat}</td>  {/* Label for Total Fat */}
                        <td><strong>Węglowodany:</strong> {totalRow.carbs}</td>  {/* Label for Total Carbs */}
                    </tr>
                )}
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
            <h1>Posiłki podopiczengo</h1>
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
                    <ViewDirective option="Month"/>
                </ViewsDirective>
                <Inject services={[Day, Week, Month]}/>
            </ScheduleComponent>
            <button onClick={handleReturn}>Powrót</button>
        </div>
    );
};

export default StudentsMealsPage;
