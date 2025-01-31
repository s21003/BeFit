import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../styles/ProfileComponent.css"

const ProfileComponent = ({ profileData, setProfileData }) => {
    const [editData, setEditData] = useState({});
    const [role, setRole] = useState("");
    const [changeError, setChangeError] = useState("");

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
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.ROLE[0].authority);

            setEditData({
                id: profileData?.id,
                name: profileData?.name || "",
                surname: profileData?.surname || "",
                address: profileData?.address || "",
                username: profileData?.username || "",
                password: "",
                trainerId: 0,
                description: profileData?.description || "",
                specializations: profileData?.specializations || [],
            });

            if (decodedToken.ROLE[0].authority === "TRAINER") {
                const fetchTrainerData = async () => {
                    const response = await fetch(`http://localhost:8080/trainer/username/${profileData.username}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch trainer data! Status: ${response.status}`);
                    }

                    const trainerData = await response.json();

                    setEditData((prevData) => ({
                        ...prevData,
                        trainerId: trainerData.id,
                        description: trainerData.description || prevData.description,
                        specializations: trainerData.specializations || prevData.specializations,
                    }));
                };

                fetchTrainerData();
            }

        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }, [profileData]);

    const handleFieldChange = (name, value) => {
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveUserData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Token is missing");
            return;
        }

        const updateUserPayload = {
            name: editData.name,
            surname: editData.surname,
            address: editData.address,
        };

        const updateTrainerPayload = {
            id: editData.trainerId,
            description: editData.description,
            specializations: editData.specializations,
        };

        try {
            const response = await fetch("http://localhost:8080/user/updateUser", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateUserPayload),
            });

            if (!response.ok) {
                throw new Error(`Update user failed! Status: ${response.status}`);
            }
            console.log("User details updated successfully");

            const trainerResponse = await fetch("http://localhost:8080/trainer/update", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateTrainerPayload),
            })
            if (!trainerResponse.ok) {
                throw new Error(`Update trainer failed! Status: ${trainerResponse.status}`);
            }

            console.log("Trainer data updated successfully");

            if (typeof setProfileData === "function") {
                setProfileData({ ...profileData, ...updateUserPayload });
            }

            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
        window.location.reload();
    };

    const handleSpecializationChange = (e) => {
        const selectedSpecialization = e.target.value;

        if (selectedSpecialization && !editData.specializations.includes(selectedSpecialization)) {
            setEditData({
                ...editData,
                specializations: [...editData.specializations, selectedSpecialization]
            });
        }
    };


    const handleSpecializationRemove = (spec) => {
        setEditData({
            ...editData,
            specializations: editData.specializations.filter((s) => s !== spec)
        });
    };

    const isTrainer = role === "TRAINER";

    return (
        <div className="profileTab">
            <form className="editForm">
                <label>Imię:</label>
                <input type="text" name="name" value={editData.name} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} />

                <label>Nazwisko:</label>
                <input type="text" name="surname" value={editData.surname} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} />

                <label>Adres:</label>
                <input type="text" name="address" value={editData.address} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} />

                {changeError && <p className="error-message">{changeError}</p>}

                {isTrainer && (
                    <>
                        <label>Specjalizacje:</label>
                        <select
                            id="specializations-select"
                            className="inputStyle"
                            name="category"
                            value=""
                            onChange={handleSpecializationChange}
                        >
                            <option value="" disabled>-- Wybierz specjalizacje --</option>
                            {Object.entries(specializations).map(([displaySpecializations, internalValue]) => (
                                !editData.specializations.includes(internalValue) && (
                                    <option key={internalValue} value={internalValue}>
                                        {displaySpecializations}
                                    </option>
                                )
                            ))}
                        </select>


                        <div className="specializationTags">
                            {editData.specializations.map((spec, index) => (
                                <div key={index} className="specializationTag">
                                    <span>{spec}</span>
                                    <button type="button" onClick={() => handleSpecializationRemove(spec)}>✕</button>
                                </div>
                            ))}
                        </div>

                        <label>Opis:</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                        />
                    </>
                )}

                <button type="button" onClick={handleSaveUserData}>Zapisz zmiany</button>

            </form>
        </div>
    );
};

export default ProfileComponent;
