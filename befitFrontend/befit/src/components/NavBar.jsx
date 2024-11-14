import "../styles/NavBar.css"
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import {CustomLink} from "../helpers/CustomLink";

export default function NavBar() {
    return <nav className="nav">
        <Link to="/home" className="site-title">Strona główna</Link>
        <ul>
            <CustomLink to="/all-trainings">Treningi</CustomLink>
            <CustomLink to="/all-trainers">Trenerzy</CustomLink>
            <CustomLink to="/all-meals">Posiłki</CustomLink>
            <CustomLink to="/chat">Czat</CustomLink>
            <CustomLink to="/goals">Cele</CustomLink>
            <CustomLink to="/settings">Ustawienia</CustomLink>
            <CustomLink to="/logout">Wyloguj</CustomLink>
        </ul>
    </nav>
}

