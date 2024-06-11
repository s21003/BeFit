import React from 'react';
import '../styles/HomePage.css';
import {Link} from "react-router-dom";

const HomePage = () => (
    <div className="mainPage">
        <nav className="mainNavigation">
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Log in</Link>
            <Link to="/all-products">All Products</Link>
            {/*<Link to="/add-product">Add Products</Link>*/}
            <Link to="/all-trainers">All Trainers</Link>
            <Link to="/all-trainings">All Trainings</Link>
            {/*<Link to="/all-meals">All Meals</Link>*/}
            {/*<Link to="/all-meal-schemas">All Meal Schemas</Link>*/}
            {/*<Link to="/all-exercises">All Exercises</Link>*/}
            {/*<Link to="/goals">All Goals</Link>*/}
        </nav>
    </div>
);

export default HomePage;