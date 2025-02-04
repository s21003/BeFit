import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import "../../styles/items/DetailsItemsPage.css"
import NavBar from "../../components/NavBar";
import {jwtDecode} from "jwt-decode";

const DetailsExercisePage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [exerciseDetails, setExerciseDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        name: '',
        part: '',
        videoLink: '',
    });

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/exercise/${id}`,{
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
                console.log("data: ",data)
                if (data) {
                    const initialPart = Object.keys(partOptions).find(key => partOptions[key] === data.part); // Find the key for the initial value
                    setExerciseDetails(data);
                    setEditFormData({
                        name: data.name,
                        part: initialPart, // Set the initial part to the Polish name
                        videoLink: data.videoLink || '',
                    });
                }
            } catch (error) {
                console.error("Fetching exercise details failed: ", error);
                setExerciseDetails(null);
            }
        };
        fetchExerciseDetails();
    }, [id]);

    const handleEdit = () => {
        setEditFormData({
            name: exerciseDetails.name,
            part: exerciseDetails.part,
            videoLink: exerciseDetails.videoLink,
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const updatedData = {
            id: exerciseDetails.id,
            ...editFormData,
            part: partOptions[editFormData.part] // Use partOptions to get the enum value
        };
        console.log("updatedData: ", updatedData);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/exercise/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Exercise updated successfully');
                navigate("/own-exercises")
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Updating exercise details failed: ", error);
        }
    };

    const handleDelete = async () => {
        const deletedData = { id: exerciseDetails.id, ...editFormData };
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/exercise/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(deletedData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Successfully deleted exercise");
                navigate('/all-exercises')
            } catch (error) {
                console.error("Delete exercise failed: ", error);
            }
        }
    };

    const partOptions = {
        "Klatka piersiowa": "KLATKAPIERSIOWA", // Updated enum values
        "Biceps": "BICEPS",
        "Triceps": "TRICEPS",
        "Brzuch": "BRZUCH",
        "Plecy": "PLECY",
        "Barki": "BARKI",
        "Nogi": "NOGI",
        "Cardio": "CARDIO",
    };

    const handleReturn = () => {
        navigate(`/own-exercises`)
    }

    return (
        <div className="detailsItems-container">
            <NavBar />
            <div className="detailsItems">
                <h2 className="detailsHeader">Szczegóły ćwiczenia</h2>
                {exerciseDetails ? (
                    <>
                        {(
                            <div className="detailsItems-table">
                                <form className="detailsItemsForm" onSubmit={handleSubmitEdit}>
                                    <strong>Nazwa ćwiczenia:</strong>
                                    <input
                                        type="text"
                                        name="name"
                                        className="inputStyle"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                    />
                                    <strong>Partia ciała:</strong>
                                    <select
                                        className="inputStyle"
                                        name="part"
                                        value={editFormData.part} // Use editFormData.part for value
                                        onChange={e => setEditFormData({...editFormData, part: e.target.value})}
                                    >
                                        {Object.keys(partOptions).map(part => (
                                            <option key={part} value={part}>{part}</option> // Use Polish name for option value
                                        ))}
                                    </select>
                                    <strong>Link do wideo:</strong>
                                    <input
                                        type="text"
                                        name="videoLink"
                                        className="inputStyle"
                                        value={editFormData.videoLink}
                                        onChange={e => setEditFormData({ ...editFormData, videoLink: e.target.value })}
                                    />
                                    <div className="detailsItems-buttons-container">
                                        <button type="submit" className="detailsItems-save-btn">Zapisz zmiany</button>
                                        <button onClick={handleDelete} className="detailsItems-delete-btn">Usuń ćwiczenie</button>
                                        <button onClick={handleReturn} className="detailsItems-return-btn">Powrót</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Loading exercise details...</p>
                )}
            </div>
        </div>
    );
};

export default DetailsExercisePage;
