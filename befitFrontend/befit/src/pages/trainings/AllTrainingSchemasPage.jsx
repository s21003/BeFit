import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/schema/SchemaPage.css"
import {jwtDecode} from "jwt-decode";

const AllTrainingSchemasPage = () => {
    const navigate = useNavigate();
    const [trainingSchemas, setTrainingSchemas] = useState([]);
    const [trainingSchemaExercise, setTrainingSchemaExercise] = useState([]);

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token)

            try {
                const response = await fetch(`http://localhost:8080/trainingSchema/username/${decodedToken.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
                const userSchemas = await response.json();

                const userResponse = await fetch(`http://localhost:8080/user/${decodedToken.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!userResponse.ok) throw new Error(`HTTP error! Status: ${userResponse.status}`);
                const userData = await userResponse.json();

                const sharedResponse = await fetch(`http://localhost:8080/userTrainer/sharedTrainingSchemas/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!sharedResponse.ok) throw new Error(`HTTP error! Status: ${sharedResponse.status}`);
                const sharedSchemas = await sharedResponse.json();

                setTrainingSchemas([...userSchemas,...sharedSchemas]); // Combine schemas
            } catch (error) {
                console.error("Fetching trainingSchemas failed: ", error);
            }
        };
        fetchTrainingSchemas()
    }, [])

    const handleRowClick = (trainingSchemaId) => {
        navigate(`/training-schema/${trainingSchemaId}`);
    };

    const handleAddSchema = () => {
        navigate(`/add-training-schema`);
    }

    const handleReturn = () => {
        navigate(`/all-trainings`);
    }

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    return (
        <div className="schemaPage-container">
            <NavBar/>
            <h1>Twoje schematy treningów</h1>
            {trainingSchemas.length > 0 ? (
                <div className="schemaPage">
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Kategoria</th>
                            <th>Data utworzenia</th>
                            <th>Pochodzenie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainingSchemas.map(trainingSchema => (
                            <tr key={trainingSchema.id} onClick={() => handleRowClick(trainingSchema.id)}>
                                <td>{trainingSchema.name}</td>
                                <td>{trainingSchema.category}</td>
                                <td>{trainingSchema.creationDate}</td>
                                <td>{trainingSchema.creatorUsername === decodedToken.sub ? "Utworzone" : "Otrzymano od trenera"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Brak dostępnych schematów treningów.</p>
            )}
            <div className="schemaPage-button-container">
                <button className="schemaPage-add-btn" type="submit" onClick={handleAddSchema}>Dodaj schemat</button>
                <button className="schemaPage-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AllTrainingSchemasPage;