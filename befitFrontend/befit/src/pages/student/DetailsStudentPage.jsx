import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/DetailsStudentPage.css"

const DetailsStudentPage = () => {
    const { username } = useParams(); // Get the selected student ID from the URL
    const [student, setStudent] = useState(null);
    const [userTrainerData, setUserTrainerData] = useState(null);  // To store the userTrainer data
    const [isLoading, setIsLoading] = useState(true);
    const [studentUsername, setStudentUsername] = useState(''); // Store the student's username here
    const navigate = useNavigate();

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

                // Fetch the userTrainer data
                const trainerResponse = await fetch(`http://localhost:8080/userTrainer/user/${studentData.id}`, {
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
                setUserTrainerData(trainerData);  // Store userTrainer data

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching student details or userTrainer data: ", error);
                setIsLoading(false);
            }
        };

        fetchStudentDetails();
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

    return (
        <div className="studentDetails-container">
            <NavBar />
            <h1>Szczegóły podopiecznego</h1>
            <div className="studentDetails">
                <p><strong>Imię:</strong> {student.name}</p>
                <p><strong>Nazwisko:</strong> {student.surname}</p>
                <p><strong>Adres:</strong> {student.address}</p>

                {/* Display the timestamp from userTrainer */}
                {userTrainerData && userTrainerData.timestamp && (
                    <p><strong>Współpraca od:</strong> {new Date(userTrainerData.timestamp).toLocaleDateString()}</p>
                )}
            </div>

            <div className="studentActions">
                <button className="btn" onClick={handleViewMeals}>Zobacz posiłki</button>
                <button className="btn" onClick={handleViewTrainings}>Zobacz treningi</button>
                <button className="btn" onClick={handleViewGoals}>Zobacz cele</button>
                <button className="btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default DetailsStudentPage;
