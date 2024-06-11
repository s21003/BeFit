import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../helpers/UserContext";

const DetailsTrainerPage = () => {
    let { id } = useParams();
    const { user } = useContext(UserContext);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({
        name: '',
        surname: '',
        address: '',
        password: '',
        specializations: '',
    });

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/trainer/${id}`,{
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
                setTrainerDetails(data);
            } catch (error) {
                console.error("Fetching trainer details failed: ", error);
                setTrainerDetails(null);
            }
        };
        fetchTrainerDetails();
    }, [id]);

    const handleEdit = () => {
        if (trainerDetails) {
            setEditFormData({
                name: trainerDetails.name,
                surname: trainerDetails.surname,
                address: trainerDetails.address,
                password: trainerDetails.password,
                specializations: trainerDetails.specializations,
            });
        }
    };



    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const updatedData = { id: trainerDetails.id, ...editFormData };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/trainer/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Trainer updated successfully');
                navigate("/all-trainers")
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Updating trainer details failed: ", error);
        }
    };

    const handleDelete = async () => {
        const deletedData = { id: trainerDetails.id, ...editFormData };
        deletedData.specializations = null;
        if (window.confirm("Are you sure you want to delete this trainer?")) {
            try {
                const response = await fetch(`http://localhost:8080/trainer/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(deletedData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert("Successfully deleted trainer");
                navigate('/all-trainers')
            } catch (error) {
                console.error("Delete trainer failed: ", error);
            }
        }
    };

    return (
        <div className="mainPage">
            {user && <h1>Hello, {user.username}</h1>}
            <nav className="mainNavigation">
                <Link to="/all-trainers">All Trainers</Link>
            </nav>
            <div className="detailsContainer">
                <h2 className="detailsHeader">Trainer Details</h2>
                {trainerDetails ? (
                    <>
                        <div className="detailsContent"><strong>Imię:</strong> {trainerDetails.name}</div>
                        <div className="detailsContent"><strong>Nazwisko:</strong> {trainerDetails.surname}</div>
                        <div className="detailsContent"><strong>Adres:</strong> {trainerDetails.address}</div>
                        <div className="detailsContent"><strong>Hasło:</strong> {trainerDetails.password}</div>
                        <div className="detailsContent"><strong>Specjalizacje:</strong> {trainerDetails.specializations}</div>
                        {(
                            <>
                                <button onClick={handleDelete} className="submitButton">Delete trainer</button>
                                <button onClick={handleEdit} className="submitButton">Edit trainer</button>
                                <form onSubmit={handleSubmitEdit}>
                                    <input
                                        type="text"
                                        name="name"
                                        className="inputStyle"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                        placeholder="Imię"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="text"
                                        name="surname"
                                        value={editFormData.surname}
                                        onChange={e => setEditFormData({...editFormData, surname: e.target.value})}
                                        placeholder="Nazwisko"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="text"
                                        name="address"
                                        value={editFormData.address}
                                        onChange={e => setEditFormData({...editFormData, address: e.target.value})}
                                        placeholder="Adres"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="text"
                                        name="password"
                                        value={editFormData.password}
                                        onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                                        placeholder="Hasło"
                                    />
                                    <input
                                        className="inputStyle"
                                        type="text"
                                        name="specializations"
                                        value={editFormData.specializations}
                                        onChange={e => setEditFormData({...editFormData, specializations: e.target.value})}
                                        placeholder="Specjalizacje"
                                    />
                                    <button type="submit" className="submitButton">Update Trainer</button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <p>Loading trainer details...</p>
                )}
            </div>
        </div>
    );
};

export default DetailsTrainerPage;
