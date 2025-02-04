import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import GoalComponent from "../../components/Profile/GoalComponent";
import ProfileComponent from "../../components/Profile/ProfileComponent";
import NavBar from "../../components/NavBar";
import "../../styles/profile/ProfilePage.css"

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            const username = decodedToken.sub;

            const fetchUserProfile = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/user/${username}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setProfileData(data);
                } catch (error) {
                    console.error("Fetching user profile failed: ", error);
                }
            };

            fetchUserProfile();
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }, []);

    const fetchGoals = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        try {
            const response = await fetch(`http://localhost:8080/goal/user/${username}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGoals(data);
        } catch (error) {
            console.error("Fetching goals failed: ", error);
        }
    };

    const updateProfileField = async (field, value) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8080/user/update`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ field, value })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedProfile = { ...profileData, [field]: value };
            setProfileData(updatedProfile);
        } catch (error) {
            console.error(`Updating field ${field} failed: `, error);
        }
    };

    if (!profileData) return <p>Loading profile...</p>;

    return (
        <div className="profilePage-container">
            <NavBar />
            <div className="profilePage">
                <h1>Witaj, {profileData.name} {profileData.surname}</h1>
                <div className="profilePage-tabs">
                    <button
                        className={`profilePage-tabButton ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profil
                    </button>
                    <button
                        className={`profilePage-tabButton ${activeTab === "goals" ? "active" : ""}`}
                        onClick={() => {
                            setActiveTab("goals");
                            fetchGoals();
                        }}
                    >
                        Cele
                    </button>
                </div>
                <div className="profilePage-tab-content">
                    {activeTab === "profile" && (
                        <ProfileComponent
                            profileData={profileData}
                            updateProfileField={updateProfileField}
                        />
                    )}
                    {activeTab === "goals" && <GoalComponent />}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
