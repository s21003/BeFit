import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/stundent/DetailsStudentPage.css"
import ShareMealSchemaModal from "../../components/Meal/ShareMealSchemaModal";
import ShareTrainingSchemaModal from "../../components/Training/ShareTrainingSchemaModal";
import {jwtDecode} from "jwt-decode";

const DetailsStudentPage = () => {
    const { username } = useParams(); // Get the selected student ID from the URL
    const [student, setStudent] = useState(null);
    const [userTrainerData, setUserTrainerData] = useState(null);  // To store the userTrainer data
    const [isLoading, setIsLoading] = useState(true);
    const [studentUsername, setStudentUsername] = useState(''); // Store the student's username here
    const navigate = useNavigate();
    const [showMealSchemaModal, setShowMealSchemaModal] = useState(false);
    const [showTrainingSchemaModal, setShowTrainingSchemaModal] = useState(false);
    const [trainerMealSchemas, setTrainerMealSchemas] = useState([]); // Store trainer's meal schemas
    const [trainerTrainingSchemas, setTrainerTrainingSchemas] = useState([]); // Store trainer's training schemas

    useEffect(() => {
        const fetchStudentDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                // Fetch student details
                const studentResponse = await fetch(`http://localhost:8080/user/${username}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!studentResponse.ok) {
                    throw new Error(`HTTP error! status: ${studentResponse.status}`);
                }

                const studentData = await studentResponse.json();
                setStudent(studentData); // Store student details in state
                setStudentUsername(studentData.username); // Set the username in state

                const decodedToken = jwtDecode(token)
                const trainerDataResponse = await fetch(`http://localhost:8080/user/${decodedToken.sub}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!studentResponse.ok) {
                    throw new Error(`HTTP error! status: ${studentResponse.status}`);
                }

                const trainer = await trainerDataResponse.json();

                const trainerResponse = await fetch(`http://localhost:8080/userTrainer/user/${studentData.id}?trainerId=${trainer.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!trainerResponse.ok) {
                    throw new Error(`HTTP error! status: ${trainerResponse.status}`);
                }

                const trainerData = await trainerResponse.json();
                setUserTrainerData(trainerData);

                if (!trainerResponse.ok) {
                    throw new Error(`HTTP error! status: ${trainerResponse.status}`);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching student details or userTrainer data: ", error);
                setIsLoading(false);
            }
        };



        fetchStudentDetails();
    }, [username]);

    useEffect(() => {


        const fetchTrainerSchemas = async () => {
            const token = localStorage.getItem("token");
            const decodeToken = jwtDecode(token)
            try {
                const mealSchemaResponse = await fetch(`http://localhost:8080/mealSchema/username/${decodeToken.sub}`, { // Adjust the endpoint
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (mealSchemaResponse.ok) {
                    const mealSchemaData = await mealSchemaResponse.json();
                    setTrainerMealSchemas(mealSchemaData);
                } else {
                    console.error("Error fetching meal schemas:", mealSchemaResponse.status);
                }

                const trainingSchemaResponse = await fetch(`http://localhost:8080/trainingSchema/username/${decodeToken.sub}`, { // Adjust the endpoint
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (trainingSchemaResponse.ok) {
                    const trainingSchemaData = await trainingSchemaResponse.json();
                    setTrainerTrainingSchemas(trainingSchemaData);
                } else {
                    console.error("Error fetching training schemas:", trainingSchemaResponse.status);
                }

            } catch (error) {
                console.error("Error fetching schemas:", error);
            }
        };

        fetchTrainerSchemas(); // Call this function after fetching UserTrainer data

    }, [username]);

    const handleViewMeals = () => {
        navigate(`/students-meals/${studentUsername}`);  // Use the username from the state
    };

    const handleViewTrainings = () => {
        navigate(`/students-trainings/${studentUsername}`);  // Use the username from the state
    };

    const handleViewGoals = () => {
        navigate(`/students-goals/${studentUsername}`);  // Use the username from the state
    };

    const handleReturn = () => {
        navigate(`/own-students`);  // Use the username from the state
    };

    if (isLoading) {
        return <p>Loading student details...</p>;
    }

    if (!student) {
        return <p>Student not found.</p>;
    }

    const handleShareMealsSchema = () => {
        setShowMealSchemaModal(true);
    };

    const handleShareTrainingsSchema = () => {
        setShowTrainingSchemaModal(true);
    };

    const handleCloseMealSchemaModal = () => {
        setShowMealSchemaModal(false);
    };

    const handleCloseTrainingSchemaModal = () => {
        setShowTrainingSchemaModal(false);
    };

    const handleMealSchemaShared = async (selectedMealSchemaIds) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/userTrainer/shareMealSchemas/${userTrainerData.id}`, { // Use userTrainerData.id
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedMealSchemaIds),
            });

            if (response.ok) {
                setShowMealSchemaModal(false); // Close the modal
                // Optionally, you can update the userTrainerData or refresh the page
            } else {
                console.error("Error sharing meal schemas:", response.status);
            }
        } catch (error) {
            console.error("Error sharing meal schemas:", error);
        }
    };


    const handleTrainingSchemaShared = async (selectedTrainingSchemaIds) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/userTrainer/shareTrainingSchemas/${userTrainerData.id}`, { // Use userTrainerData.id
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedTrainingSchemaIds),
            });

            if (response.ok) {
                setShowTrainingSchemaModal(false); // Close the modal
                // Optionally, you can update the userTrainerData or refresh the page
            } else {
                console.error("Error sharing training schemas:", response.status);
            }
        } catch (error) {
            console.error("Error sharing training schemas:", error);
        }
    };

    return (
        <div className="studentDetails-container">
            <NavBar />
            <h1>Szczegóły podopiecznego</h1>
            <div className="studentDetails">
                <p><strong>Imię:</strong> {student.name}</p>
                <p><strong>Nazwisko:</strong> {student.surname}</p>
                <p><strong>Adres:</strong> {student.address}</p>
                {userTrainerData && userTrainerData.timestamp && (
                    <p><strong>Współpraca od:</strong> {new Date(userTrainerData.timestamp).toLocaleDateString()}</p>
                )}
            </div>

            <div className="studentDetails-buttons-container">
                <button className="studentDetails-btn" onClick={handleViewMeals}>Zobacz posiłki</button>
                <button className="studentDetails-btn" onClick={handleViewTrainings}>Zobacz treningi</button>
                <button className="studentDetails-share-btn" onClick={handleShareMealsSchema}>
                    Udostępnij schemat posiłku
                </button>
                <button
                    className="studentDetails-share-btn"
                    onClick={handleShareTrainingsSchema}
                >
                    Udostępnij schemat treningu
                </button>
                <button className="studentDetails-btn" onClick={handleViewGoals}>Zobacz cele</button>
                <button className="studentDetails-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
            {showMealSchemaModal && (
                <ShareMealSchemaModal
                    closeModal={() => setShowMealSchemaModal(false)}
                    mealSchemas={trainerMealSchemas} // Pass the trainer's meal schemas
                    onMealSchemaShared={handleMealSchemaShared} // Pass the callback function
                    userTrainerId={userTrainerData.id}
                />
            )}

            {showTrainingSchemaModal && (
                <ShareTrainingSchemaModal
                    closeModal={() => setShowTrainingSchemaModal(false)}
                    trainingSchemas={trainerTrainingSchemas} // Pass the trainer's training schemas
                    onTrainingSchemaShared={handleTrainingSchemaShared} // Pass the callback function
                    userTrainerId={userTrainerData.id}
                />
            )}
        </div>
    );
};

export default DetailsStudentPage;
