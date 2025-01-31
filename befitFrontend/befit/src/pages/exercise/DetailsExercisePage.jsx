import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import "../../styles/DetailsItemsPage.css"
import NavBar from "../../components/NavBar";

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
                    setExerciseDetails(data);
                    setEditFormData({ // Set initial form data *after* fetching
                        name: data.name,
                        part: data.part,
                        videoLink: data.videoLink || '', // Handle potential null value
                    })
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

        let enumPart = exerciseDetails.part; // Default to the original value

        if (editFormData.part !== exerciseDetails.part) {
            const selectedPartKey = Object.keys(partOptions).find(key => partOptions[key] === editFormData.part);
            enumPart = selectedPartKey ? partOptions[selectedPartKey] : null; // Use null if no match
        }

        const updatedData = {
            id: exerciseDetails.id,
            ...editFormData,
            part: enumPart // Include the enum value in the data sent to the backend
        };
        console.log("updatedData: ",updatedData);

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
                            <>
                                <form onSubmit={handleSubmitEdit}>
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
                                        value={editFormData.part} // Display value
                                        onChange={e => setEditFormData({...editFormData, part: e.target.value})}
                                    >
                                        {Object.keys(partOptions).map(part => (
                                            <option key={part} value={part}>{part}</option>
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
                                    <div className="buttons-container">
                                        <button type="submit" className="btn">Zapisz zmiany</button>
                                        <button onClick={handleDelete} className="btn-delete">Usuń ćwiczenie</button>
                                        <button onClick={handleReturn} className="btn">Powrót</button>
                                    </div>
                                </form>
                            </>
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
