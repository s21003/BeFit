import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { jwtDecode } from "jwt-decode";
import "../../styles/user/HomePage.css";

const HomePage = () => {
    const [role, setRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [meals, setMeals] = useState([]);
    const [mealProductsMap, setMealProductsMap] = useState({});
    const [trainings, setTrainings] = useState({
        upcoming: [],
        past: []
    });
    const [trainers, setTrainers] = useState([]);
    const [userTrainers, setUserTrainers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [goals, setGoals] = useState(null);
    const specializations = {
        CARDIO: "Cardio",
        SILOWY: "Siłowy",
        CROSSFIT: "Crossfit",
        FITNESS: "Fitness",
        GRUPOWY: "Grupowy",
        KLATKAPIERSIOWA: "Klatka piersiowa",
        BICEPS: "Biceps",
        TRICEPS: "Triceps",
        BRZUCH: "Brzuch",
        PLECY: "Plecy",
        BARKI: "Barki",
        NOGI: "Nogi",
        DIETETYK: "Dietetyk"
    };
    const labelTranslations = {
        "Sniadanie": "Śniadanie",
        "DrugieSniadanie": "Drugie śniadanie",
        "Obiad": "Obiad",
        "Przekaska": "Przekąska",
        "Kolacja": "Kolacja",
    };


    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const todayDate = getTodayDate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.ROLE?.[0]?.authority || null);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.ROLE?.[0]?.authority || null);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/user/${username}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);
                setUserId(data.id);
            } catch (error) {
                console.error("Fetching user profile failed: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchMeals = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/meal/user/${username}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const mealData = await response.json();
                setMeals(mealData);
            } catch (error) {
                console.error("Fetching meals failed: ", error);
            }
        };

        fetchMeals();
    }, []);

    const todaysMeals = meals.filter((meal) => {
        const mealDate = meal.startTime.split("T")[0];
        return mealDate === todayDate;
    });

    useEffect(() => {
        const fetchProductsForMeals = async () => {
            const token = localStorage.getItem("token");
            if (token && meals.length > 0) {
                try {
                    const newMealProductsMap = {};

                    for (const meal of meals) {
                        try {
                            const productsForMeal = [];
                            let totalKcal = 0;
                            let totalProtein = 0;
                            let totalFat = 0;
                            let totalCarbs = 0;

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
                                name: "Total",
                                kcal: totalKcal,
                                protein: totalProtein,
                                fat: totalFat,
                                carbs: totalCarbs,
                                weight: null,
                            });

                            newMealProductsMap[meal.id] = productsForMeal;
                        } catch (error) {
                            console.error(`Failed to fetch products for meal ID: ${meal.id}`, error);
                            newMealProductsMap[meal.id] = [];
                        }
                    }
                    setMealProductsMap(newMealProductsMap);
                } catch (error) {
                    console.error("Fetching products for meals failed:", error);
                }
            }
        };

        fetchProductsForMeals();
    }, [meals]);

    useEffect(() => {
        const fetchTrainers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/trainer/all`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainers(data);
            } catch (error) {
                console.error("Fetching trainers failed: ", error);
            }
        };
        fetchTrainers();
    }, []);

    useEffect(() => {
        if (trainers.length === 0) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchTrainings = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                const response = await fetch(`http://localhost:8080/training/user/${username}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const trainingData = await response.json();

                const todayDate = getTodayDate();

                const trainingsWithTrainerInfo = trainingData.map((training) => {
                    const trainer = trainers.find((trainer) => trainer.id === training.trainerId);
                    if (trainer) {
                        return {
                            ...training,
                            trainerName: trainer.user.name,
                            trainerSurname: trainer.user.surname,
                        };
                    }
                    return training;
                });

                const upcomingTrainings = trainingsWithTrainerInfo.filter(training => {
                    return new Date(training.startTime) >= new Date(todayDate);
                }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                const pastTrainings = trainingsWithTrainerInfo.filter(training => {
                    return new Date(training.startTime) < new Date(todayDate);
                }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

                setTrainings({
                    upcoming: upcomingTrainings.slice(0, 5),
                    past: pastTrainings.slice(0, 5)
                });

            } catch (error) {
                console.error("Fetching trainings failed: ", error);
            }
        };

        fetchTrainings();
    }, [trainers]);

    useEffect(() => {
        if (!userId) return;

        const fetchUsersTrainers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/userTrainer/studentsTrainers/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const acceptedTrainers = data.filter((trainer) => trainer.status === "ACCEPTED");

                const matchedTrainers = acceptedTrainers
                    .map((userTrainer) =>
                        trainers.find((trainer) => trainer.id === userTrainer.trainerId)
                    )
                    .filter((trainer) => trainer !== undefined);

                setUserTrainers(matchedTrainers);
            } catch (error) {
                console.error("Fetching user's trainers failed: ", error);
            }
        };

        fetchUsersTrainers();
    }, [userId, trainers]);

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
            }
        };

        fetchGoals();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="homePage-container">
            <NavBar role={role} />
            <div className="homePage">
                <div className="user-info">
                    {isLoggedIn && userData ? (
                        <h1>Witaj, {userData.name} {userData.surname}</h1>
                    ) : (
                        <div className="auth-buttons">
                            <h1>Witaj!</h1>
                            <div className="buttons-container">
                                <a href="/login" className="auth-button">Zaloguj się</a>
                                <a href="/signup" className="auth-button">Zarejestruj się</a>
                            </div>
                        </div>
                    )}
                </div>
                {isLoggedIn && (
                    <div className="homePage-content-container">
                        <div className="homePage-leftSection">
                            <div className="meals-table">
                                <h2>Dzisiejsze posiłki</h2>
                                <table>
                                    <thead className="meals-table-thead">
                                    <tr>
                                        <th className="meals-table-th">Etykieta posiłku</th>
                                        <th className="meals-table-th">Kalorie</th>
                                        <th className="meals-table-th">Białko</th>
                                        <th className="meals-table-th">Tłuszcze</th>
                                        <th className="meals-table-th">Węglowodany</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <td><strong>Łącznie / Cel</strong></td>
                                        <td>
                                            {todaysMeals.reduce((acc, meal) => acc + (mealProductsMap[meal.id]?.find(p => p.name === "Total")?.kcal || 0), 0)}
                                            {goals && ` / ${goals.plannedDailyKcal}`}
                                        </td>
                                        <td>
                                            {todaysMeals.reduce((acc, meal) => acc + (mealProductsMap[meal.id]?.find(p => p.name === "Total")?.protein || 0), 0)}
                                            {goals && ` / ${goals.plannedDailyProteins}`}
                                        </td>
                                        <td>
                                            {todaysMeals.reduce((acc, meal) => acc + (mealProductsMap[meal.id]?.find(p => p.name === "Total")?.fat || 0), 0)}
                                            {goals && ` / ${goals.plannedDailyFats}`}

                                        </td>
                                        <td>
                                            {todaysMeals.reduce((acc, meal) => acc + (mealProductsMap[meal.id]?.find(p => p.name === "Total")?.carbs || 0), 0)}
                                            {goals && ` / ${goals.plannedDailyCarbs}`}

                                        </td>
                                    </tr>
                                    </tfoot>
                                    <tbody className="meals-table-tbody">
                                    {todaysMeals.length > 0 ? (
                                        todaysMeals.map((meal) => {
                                            const products = mealProductsMap[meal.id] || [];
                                            const mealTotal = products.find((product) => product.name === "Total");
                                            return (
                                                <tr key={meal.id}>
                                                    <td className="meals-table-tbody-td">{labelTranslations[meal.label] || meal.label}</td>
                                                    <td className="meals-table-tbody-td">{mealTotal?.kcal || 0}</td>
                                                    <td className="meals-table-tbody-td">{mealTotal?.protein || 0}</td>
                                                    <td className="meals-table-tbody-td">{mealTotal?.fat || 0}</td>
                                                    <td className="meals-table-tbody-td">{mealTotal?.carbs || 0}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Brak posiłków na dziś</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {role !== "TRAINER" && (
                                <div className="home-trainers-table" style={{width: '100%'}}>
                                    <h2>Twoi trenerzy</h2>
                                    <div className="home-trainers-table-wrapper">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Imię trenera</th>
                                                <th>Nazwisko trenera</th>
                                                <th>Specjalizacje</th>
                                                <th>Opis</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {userTrainers && userTrainers.length > 0 ? (
                                                userTrainers.map((trainer) => {
                                                    if (!trainer) return null;
                                                    const trainerUser = trainer.user || {};
                                                    const displayedSpecializations = trainer.specializations
                                                        ? trainer.specializations
                                                            .map(spec => specializations[spec] || spec)
                                                            .slice(0, 3)
                                                            .join(", ")
                                                        : "Brak specjalizacji";

                                                    return (
                                                        <tr key={trainer.id}>
                                                            <td>{trainerUser.name || "Unknown"}</td>
                                                            <td>{trainerUser.surname || "Unknown"}</td>
                                                            <td>{displayedSpecializations}</td>
                                                            <td>
                                                                {trainer.description && trainer.description.length > 100
                                                                    ? `${trainer.description.substring(0, 100)}...`
                                                                    : trainer.description}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">Brak trenerów</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="homePage-rightSection">
                            <div className="planned-trainings-table">
                                <h2>5 nadchodzących treningów</h2>
                                {trainings.upcoming.length > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Data treningu</th>
                                            <th>Kategoria</th>
                                            {role !== "TRAINER" && <th>Trener</th>}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {trainings.upcoming.map((training) => (
                                            <tr key={training.id}>
                                                <td>{formatDate(training.startTime)}</td>
                                                <td>{training.category}</td>
                                                {role !== "TRAINER" &&
                                                    <td>{training.trainerName} {training.trainerSurname}</td>}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Brak nadchodzących treningów</p>
                                )}
                            </div>

                            <div className="done-trainings-table">
                                <h2>5 ostatnich treningów</h2>
                                {trainings.past.length > 0 ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Data treningu</th>
                                            <th>Kategoria</th>
                                            {role !== "TRAINER" && <th>Trener</th>}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {trainings.past.length === 0 ? (
                                            <tr>
                                                <td colSpan="3">Brak wykonanych treningów</td>
                                            </tr>
                                        ) : (
                                            trainings.past.map((training) => (
                                                <tr key={training.id}>
                                                    <td>{formatDate(training.startTime)}</td>
                                                    <td>{training.category}</td>
                                                    {role !== "TRAINER" &&
                                                        <td>{training.trainerName} {training.trainerSurname}</td>}
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                ) : (
                                <p>Brak nadchodzących treningów</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;