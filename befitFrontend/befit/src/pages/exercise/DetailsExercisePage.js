import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

const DetailsExercisePage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [exerciseDetails, setExerciseDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        name: '',
        part: null,
        videoLink: null,
        series: null
    });

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/exercise/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExerciseDetails(data);
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
            series: exerciseDetails.series
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const updatedData = { id: exerciseDetails.id, ...editFormData };

        try {
            const response = await fetch(`http://localhost:8080/exercise/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Exercise updated successfully');
                navigate("/all-exercises")
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
                const response = await fetch(`http://localhost:8080/exercise/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
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
        "KlatkaPiersiowa":"0",
        "Biceps":"1",
        "Triceps":"2",
        "Brzuch":"3",
        "Plecy":"4",
        "Barki":"5",
        "Nogi":"6",
        "Cardio":"7"
    };

    return (
        <div className="mainPage">
            {user && <h1>Hello, {user.username}</h1>}
            <nav className="mainNavigation">
                <Link to="/all-exercises">All Exercises</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">Exercise Details</h2>
                {exerciseDetails ? (
                    <>
                        <div className="detailsContent"><strong>Nazwa:</strong> {exerciseDetails.name}</div>
                        <div className="detailsContent"><strong>Partia ciała:</strong> {exerciseDetails.part}</div>
                        <div className="detailsContent"><strong>Link:</strong> {exerciseDetails.videoLink}</div>
                        <div className="detailsContent"><strong>Serie:</strong> {exerciseDetails.series}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete exercise</button>
                                <button onClick={handleEdit} className="submitButton">Edit exercise</button>
                                <form onSubmit={handleSubmitEdit}>
                                    <input
                                        type="text"
                                        name="name"
                                        className="inputStyle"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                        placeholder="Nazwa"
                                    />
                                    <select
                                        className="inputStyle"
                                        name="part"
                                        value={editFormData.part}
                                        onChange={e => setEditFormData({...editFormData, part: e.target.value})}>
                                        {Object.keys(partOptions).map(part => (
                                            <option key={part} value={part}>{part}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="videoLink"
                                        className="inputStyle"
                                        value={editFormData.videoLink}
                                        onChange={e => setEditFormData({...editFormData, videoLink: e.target.value})}
                                        placeholder="Link"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="text"
                                        name="series"
                                        value={editFormData.series}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            series: parseFloat(e.target.value)
                                        })}
                                        placeholder="Serie"
                                    />
                                    <button type="submit" className="submitButton">Update Exercise</button>
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
