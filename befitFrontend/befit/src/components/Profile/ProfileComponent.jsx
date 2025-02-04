import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../../styles/profile/ProfileComponent.css";

const ProfileComponent = ({ profileData, setProfileData }) => {
    const [editData, setEditData] = useState({});
    const [role, setRole] = useState("");
    const [changeError, setChangeError] = useState("");

    // Map from ENUM to Polish name
    const specializations = {
        CARDIO: "Cardio",
        SILOWY: "Siłowy",
        CROSSFIT: "Crossfit",
        FITNESS: "Fitness",
        GRUPOWY: "Grupowy",
        KLATKAPIERSIOWA: "Klatka piersiowa",
        BICEPS: "Biceps",
        TRICEPS: "Triceps",
        BRZUCH: "Brzuch",
        PLECY: "Plecy",
        BARKI: "Barki",
        NOGI: "Nogi",
        DIETETYK: "Dietetyk",
    };

    // When the component loads, initialize editData with fetched specializations (store as ENUM keys)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.ROLE[0].authority);

            // IMPORTANT: store specializations as ENUM keys!
            setEditData({
                id: profileData?.id,
                name: profileData?.name || "",
                surname: profileData?.surname || "",
                address: profileData?.address || "",
                username: profileData?.username || "",
                password: "",
                trainerId: 0,
                description: profileData?.description || "",
                specializations: profileData?.specializations || [], // store as ENUM keys
            });

            if (decodedToken.ROLE[0].authority === "TRAINER") {
                const fetchTrainerData = async () => {
                    const response = await fetch(
                        `http://localhost:8080/trainer/username/${profileData.username}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Failed to fetch trainer data! Status: ${response.status}`
                        );
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
            specializations: editData.specializations, // will be the updated array of ENUM keys
        };

        console.log("update: ", updateTrainerPayload);

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
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateTrainerPayload),
            });
            if (!trainerResponse.ok) {
                throw new Error(`Update trainer failed! Status: ${trainerResponse.status}`);
            }

            console.log("Trainer data updated successfully");

            if (typeof setProfileData === "function") {
                setProfileData({ ...profileData, ...updateUserPayload });
            }

            console.log("Profile updated successfully");
            window.location.reload()
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    // When a specialization is selected, add its ENUM value to editData.specializations.
    const handleSpecializationChange = (e) => {
        const selectedSpecializationEnum = e.target.value;
        // Only add if not already selected.
        if (
            selectedSpecializationEnum &&
            !editData.specializations.includes(selectedSpecializationEnum)
        ) {
            setEditData((prevData) => ({
                ...prevData,
                specializations: [...prevData.specializations, selectedSpecializationEnum],
            }));
        }
    };

    // Remove the specialization (ENUM key) from editData.specializations.
    const handleSpecializationRemove = (spec) => {
        setEditData((prevData) => ({
            ...prevData,
            specializations: prevData.specializations.filter((s) => s !== spec),
        }));
    };

    const isTrainer = role === "TRAINER";

    return (
        <div className="profileTab">
            <form className="profileTabForm">
                <label>Imię:</label>
                <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                />

                <label>Nazwisko:</label>
                <input
                    type="text"
                    name="surname"
                    value={editData.surname}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                />

                <label>Adres:</label>
                <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                />

                {changeError && <p className="error-message">{changeError}</p>}

                {isTrainer && (
                    <div className="specializations-container">
                        <label>Specjalizacje:</label>
                        <select
                            id="specializations-select"
                            className="inputStyle"
                            name="category"
                            value=""
                            onChange={handleSpecializationChange}
                        >
                            <option value="" disabled>
                                -- Wybierz specjalizacje --
                            </option>
                            {Object.entries(specializations).map(([enumValue, polishName]) =>
                                    // Only show options not already selected.
                                    !editData.specializations.includes(enumValue) && (
                                        <option key={enumValue} value={enumValue}>
                                            {polishName}
                                        </option>
                                    )
                            )}
                        </select>

                        <div className="specializationTags">
                            {editData.specializations.map((spec, index) => (
                                <div key={index} className="specializationTag">
                                    {/* Display the Polish name using the mapping */}
                                    <span>{specializations[spec]}</span>
                                    <button type="button" onClick={() => handleSpecializationRemove(spec)}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label>Opis:</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                        />
                    </div>
                )}

                <div className="profileTabForm-buttons-container">
                    <button
                        className="profileTab-save-btn"
                        type="button"
                        onClick={handleSaveUserData}
                    >
                        Zapisz zmiany
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileComponent;
