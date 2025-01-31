import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/SchemaPage.css"

const AllTrainingSchemasPage = () => {
    const navigate = useNavigate();
    const [trainingSchemas, setTrainingSchemas] = useState([]);

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/trainingSchema/all`,{
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
                setTrainingSchemas(data);
            } catch (error) {
                console.error("Fetching trainingSchemas failed: ", error);
            }
        };
        fetchTrainingSchemas();
    }, []);

    const handleRowClick = (trainingSchemaId) => {
        navigate(`/training-schema/${trainingSchemaId}`);
    };

    const handleAddSchema = () => {
        navigate(`/add-training-schema`);
    }

    const handleReturn = () => {
        navigate(`/all-trainings`);
    }

    return (
        <div className="schemaPage-container">
            <NavBar/>

            {trainingSchemas.length > 0 ? (
                <div className="schemaPage">
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Kategoria</th>
                            <th>Pochodzenie</th>
                            <th>Data utworzenia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainingSchemas.map(trainingSchema => (
                            <tr key={trainingSchema.id} onClick={() => handleRowClick(trainingSchema.id)}>
                                <td>{trainingSchema.name}</td>
                                <td>{trainingSchema.category}</td>
                                <td>{trainingSchema.creatorUsername}</td>
                                <td>{trainingSchema.creationDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Brak dostępnych schematów treningów.</p>
            )}
            <div className="button-container">
                <button type="submit" onClick={handleAddSchema}>Dodaj schemat</button>
                <button type="submit" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AllTrainingSchemasPage;