import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/DetailsTrainerPage.css"

const DetailsTrainerPage = () => {
    let { id } = useParams();
    const [ user , setUser ] = useState(null);
    const [trainerDetails, setTrainerDetails] = useState({
        user: [],
        specializations: [],
        description: '',
    });
    const [requestStatus, setRequestStatus] = useState(null); // Store request status
    const [requestTimestamp, setRequestTimestamp] = useState(null);
    const [canSendRequest, setCanSendRequest] = useState(true); // Flag to enable/disable the button
    const navigate = useNavigate();

    const specializations = {
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

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:8080/trainer/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrainerDetails(data);
            } catch (error) {
                console.error("Fetching trainer details failed: ", error);
                setTrainerDetails(null);
            }
        };
        fetchTrainerDetails();
    }, [id]);

    useEffect(() => {
        const checkRequestStatus = async () => {
            if (!trainerDetails.id) return; // Wait until trainerDetails is populated

            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userUsername = decodedToken.sub;
            let userId;

            try {
                const response = await fetch(`http://localhost:8080/user/${userUsername}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setUser(data);
                userId = data.id;

                const requestResponse = await fetch(
                    `http://localhost:8080/userTrainer/user/${userId}?trainerId=${trainerDetails.id}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!requestResponse.ok) throw new Error(`HTTP error! status: ${requestResponse.status}`);
                const requestData = await requestResponse.json();

                setRequestStatus(requestData.status);
                setRequestTimestamp(requestData.timestamp);

                if (requestData.status === "PENDING" || requestData.status === "ACCEPTED") {
                    setCanSendRequest(false);
                } else if (requestData.status === "REJECTED") {
                    const rejectionDate = new Date(requestData.timestamp);
                    const currentDate = new Date();
                    const daysSinceRejection = (currentDate - rejectionDate) / (1000 * 3600 * 24);
                    if (daysSinceRejection < 7) {
                        setCanSendRequest(false);
                    }
                }
            } catch (error) {
                console.error("Fetching user request status failed: ", error);
            }
        };

        checkRequestStatus();
    }, [trainerDetails]); // Re-run when trainerDetails changes


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const cooperationRequest = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userUsername = decodedToken.sub;
        let userId;

        try {
            const response = await fetch(`http://localhost:8080/user/${userUsername}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            userId = data.id;
        } catch (error) {
            console.error("Fetching user failed: ", error);
        }

        try {
            const response = await fetch('http://localhost:8080/userTrainer/request', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    trainerId: id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert("Prośba o współprace wysłana pomyślnie!");

            window.location.reload();
        } catch (error) {
            console.error("Error sending cooperation request: ", error);
            alert("Nie udało się wysłać prośby o współpracę. Proszę spróbować ponownie.");
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");

        console.log("user: ",user)

        const studentPayLoad = {
            userId: user.id,
        }

        try {
            const response = await fetch(`http://localhost:8080/userTrainer/deleteTrainer/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentPayLoad)
            });

            if (response.ok) {
                alert('Pomyślnie usunięto trenera.');
                window.location.reload()
            } else {
                throw new Error('Failed to delete trainer');
            }
        } catch (error) {
            console.error("Error deleting trainer: ", error);
            alert("Nie udało się usunąć trenera.");
        }
    };

    const handleReturn = () => {
        navigate(`/all-trainers`);
    }

    const reverseSpecializations = Object.fromEntries( // Create reverse mapping
        Object.entries(specializations).map(([key, value]) => [value, key])
    );

    return (
        <div className="detailsTrainer-container">
            {user && <h1>Hej, {user.username}</h1>}
            <NavBar/>
            <div className="detailsTrainer">
                <h2 className="detailsHeader">Szczegóły trenera</h2>
                {trainerDetails ? (
                    <>
                        <div className="detailsContent"><strong>Imię:</strong> {trainerDetails.user.name}</div>
                        <div className="detailsContent"><strong>Nazwisko:</strong> {trainerDetails.user.surname}</div>
                        <div className="detailsContent"><strong>Adres:</strong> {trainerDetails.user.address}</div>
                        <div className="detailsContent">
                            <strong>Specjalizacje:</strong>
                            <ul className="specializations-list">
                                {trainerDetails.specializations.map((spec, index) => (
                                    <li key={index}>{reverseSpecializations[spec] || spec}</li> // Use reverse mapping
                                ))}
                            </ul>
                        </div>
                        <div className="detailsContent"><strong>Opis:</strong> {trainerDetails.description}</div>
                        <div className="requestStatus">
                            {requestStatus === "PENDING" && <p>Twoja prośba jest w toku.</p>}
                            {requestStatus === "ACCEPTED" && <p>Twoja prośba została zaakceptowana.</p>}
                            {requestStatus === "REJECTED" &&
                                <p>Twoja prośba została odzrucona {formatTimestamp(requestTimestamp)}. Możesz wysłać nową prośbę po 7 dniach.</p>}
                        </div>
                    </>
                ) : (
                    <p>Loading trainer details...</p>
                )}
            </div>
            <div className="buttons-container">
                {canSendRequest && (
                    <button className="btn" onClick={cooperationRequest}>Prośba o współprace</button>
                )}
                {!canSendRequest && requestStatus !== "REJECTED" && (
                    <p>Nie możesz wysłać nowej prośby o współprace do tego trenera.</p>
                )}
                {requestStatus === "ACCEPTED" && (<button className="btn-delete" onClick={handleDelete}>Zakończ wspólpracę</button>)}
                <button className="btn" type="submit" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default DetailsTrainerPage;
