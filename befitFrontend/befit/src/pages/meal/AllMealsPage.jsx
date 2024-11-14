import React, { useEffect, useState, useRef } from 'react';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/MainPage.css";
import { CustomLink } from "../../helpers/CustomLink";
import {jwtDecode} from "jwt-decode";

const AllMealsPage = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [mealSchemas, setMealSchemas] = useState([]);
    const [ownProducts, setOwnProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('allProducts');
    const scheduleObj = useRef(null);

    useEffect(() => {
        const fetchMeals = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;

                console.log("User Email from token:", userEmail, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/meal/user/${userEmail}`, {
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

                    const mappedData = data.map(meal => ({
                        Id: meal.id,
                        Products: meal.products,
                        Weight: meal.weight,
                        Time: formatDate(new Date(meal.time)),
                        IsAllDay: false
                    }));


                    setMeals(mappedData);
                } catch (error) {
                    console.error("Fetching meals failed: ", error);
                }
            } else {
                console.error("No token found, please login again.");
                navigate('/login');
            }        };
        fetchMeals();
    }, [navigate]);

    useEffect(() => {
        const fetchOwnProducts = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const creatorEmail = decodedToken.sub;

                console.log("User Email from token:", creatorEmail, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/product/user/${creatorEmail}`, {
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
                    setOwnProducts(data);
                } catch (error) {
                    console.error("Fetching own products failed: ", error);
                }
            }else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchOwnProducts();
    }, []);

    useEffect(() => {
        const fetchMealSchemas = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:8080/mealSchema/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                setMealSchemas(await response.json());
            } catch (error) {
                console.error("Fetching mealSchemas failed: ", error);
            }
        };
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/product/all`, {
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
                setProducts(data);
            } catch (error) {
                console.error("Fetching products failed: ", error);
            }
        };
        fetchMealSchemas();
        fetchProducts();
    }, []);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const renderList = () => {
        switch (selectedOption) {
            case 'allProducts':
                return products.map((product, index) => <li key={index}>{product.name}</li>);
            case 'mealSchemas':
                return mealSchemas.map((schema, index) => <li key={index}>{schema.name}</li>);
            case 'ownProducts':
                return ownProducts.map((ownProduct, index) => <li key={index}>{ownProduct.name}</li>);
            default:
                return <li>No items to display</li>;
        }
    };

    const editorTemplate = (props) => (
        <div>
            <label>
                Select list to Display:
                <select value={selectedOption} onChange={handleSelectChange}>
                    <option value="allProducts">All Products</option>
                    <option value="mealSchemas">Meal Schemas</option>
                    <option value="ownProducts">Own Products</option>
                </select>
            </label>
            <ul>{renderList()}</ul>
        </div>
    );

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated') {
            if (args.requestType === 'eventCreated') {
                const eventData = args.data[0]; // Syncfusion may send the data as an array
                console.log("Event Data:", eventData);

                const mealData = {
                    userEmail: jwtDecode(localStorage.getItem("token")).sub,  // Decode the token to get the user email
                    time: eventData.Time,
                    kcal: eventData.kcal,
                };

                console.log("mealData: ", mealData);

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

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const savedEvent = await response.json();
                    console.log("Saved Event:", savedEvent);

                    // Add the saved event to the state
                    setMeals(prevMeals => [...prevMeals, {
                        Id: savedEvent.id,
                        Subject: savedEvent.category,
                        StartTime: new Date(savedEvent.startTime),
                        IsAllDay: false
                    }]);
                } catch (error) {
                    console.error("Saving event failed:", error);
                }
            }        }
    };

    return (
        <>
            <NavBar />
            <div className="meal-buttons">
                <h1>Posiłki</h1>
                <CustomLink to="/all-meal-schemas"> Schematy posiłków</CustomLink>
                <CustomLink to="/own-products">Własne produkty</CustomLink>
            </div>
            <div>
                <ScheduleComponent
                    ref={scheduleObj}
                    width='100%'
                    height='550px'
                    currentView='DAY'
                    eventSettings={{ dataSource: meals }}
                    editorTemplate={editorTemplate.bind(this)}
                    showQuickInfo={false}
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
    );
};

export default AllMealsPage;
