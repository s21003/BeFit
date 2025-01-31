import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/TrainersPage.css"

const AllTrainersPage = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [userTrainers, setUserTrainers] = useState([]);
    const [userTrainersData, setUserTrainersData] = useState([]);
    const [userId, setUserId] = useState(null);

    // Fetch all trainers
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

    // Fetch user ID
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);

            try {
                const response = await fetch(`http://localhost:8080/user/${decoded.sub}`, {
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
                setUserId(data.id);
            } catch (error) {
                console.error("Fetching user data failed:", error);
            }
        };
        fetchUserData();
    }, []);

    // Fetch user's trainers with only accepted status
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

                // Filter for trainers with accepted cooperation status
                const acceptedTrainers = data.filter((trainer) => trainer.status === "ACCEPTED");

                // Match accepted trainers with trainer details
                const matchedTrainers = acceptedTrainers.map((userTrainer) =>
                    trainers.find((trainer) => trainer.id === userTrainer.trainerId)
                );

                setUserTrainers(acceptedTrainers);
                setUserTrainersData(matchedTrainers);
            } catch (error) {
                console.error("Fetching user's trainers failed: ", error);
            }
        };
        fetchUsersTrainers();
    }, [userId, trainers]);



    const handleRowClick = (trainerId) => {
        navigate(`/trainer/${trainerId}`);
    };

    const specializationsMap = {
        "Cardio": "CARDIO",
        "Siłowy": "SILOWY",
        "Crossfit": "CROSSFIT",
        "Fitness": "FITNESS",
        "Grupowy": "GRUPOWY",
        "Klatka piersiowa": "KLATKAPIERSIOWA",
        "Bisceps": "BICEPS",
        "Triceps": "TRICEPS",
        "Brzuch": "BRZUCH",
        "Plecy": "PLECY",
        "Barki": "BARKI",
        "Nogi": "NOGI"
    };

    const reverseSpecializations = Object.fromEntries(
        Object.entries(specializationsMap).map(([key, value]) => [value, key])
    );

    return (
        <div className="trainersPage-container">
            <NavBar />
            <div className="trainersPage">
                <div className="trainers-section left-section"> {/* Added left-section class */}
                    <h1>Wszyscy trenerzy</h1>
                    {trainers.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Adres</th>
                                <th>Specializacje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trainers.map((trainer) => (
                                <tr key={trainer.id} onClick={() => handleRowClick(trainer.id)}>
                                    <td>{trainer.user.name}</td>
                                    <td>{trainer.user.surname}</td>
                                    <td>{trainer.user.address}</td>
                                    <td>
                                        {trainer?.specializations?.length > 0 ? ( // Check trainer AND specializations
                                            trainer.specializations.map(spec => reverseSpecializations[spec] || spec).join(", ")
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Brak dostępnych trenerów.</p>
                    )}
                </div>
                <div className="trainers-section right-section"> {/* Added right-section class */}
                    <h1>Twoi trzenerzy</h1>
                    {userTrainersData.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Adres</th>
                                <th>Specializacje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userTrainersData.map((trainer, index) => (
                                <tr key={index} onClick={() => handleRowClick(trainer.id)}> {/* Added onClick */}
                                    <td>{trainer?.user?.name}</td>
                                    <td>{trainer?.user?.surname}</td>
                                    <td>{trainer?.user?.address}</td>
                                    <td>
                                        {trainer?.specializations?.length > 0 ? ( // Check trainer AND specializations
                                            trainer.specializations.map(spec => reverseSpecializations[spec] || spec).join(", ")
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Brak trenerów przydzielonych do Ciebie.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllTrainersPage;
