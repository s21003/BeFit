import "../styles/NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { CustomLink } from "../helpers/CustomLink";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    let role = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.ROLE[0].authority;
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }

    const handleLogout = () => {
        const confirmLogout = window.confirm("Czy na pewno chcesz się wylogować?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            alert("Zostałeś pomyślnie wylogowany.");
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <nav className="nav">
            <Link to="/home" className="site-title">Strona główna</Link>
            <div className="nav-links">
                <ul>
                    {!role ? (
                        <>
                            <CustomLink to="/login">Zaloguj się</CustomLink>
                            <CustomLink to="/signup">Zarejestruj się</CustomLink>
                        </>
                    ) : (
                        <>
                            <CustomLink to="/all-trainings">Treningi</CustomLink>
                            {role === "USER" && <CustomLink to="/all-trainers">Trenerzy</CustomLink>}
                            {role === "TRAINER" && <CustomLink to="/own-students">Podopieczni</CustomLink>}
                            <CustomLink to="/all-meals">Posiłki</CustomLink>
                            <CustomLink to="/profile">Profil</CustomLink>
                            <CustomLink to="/tmpChat">Czat</CustomLink>
                            <button className="logout-button" onClick={handleLogout}>
                                Wyloguj
                            </button>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
