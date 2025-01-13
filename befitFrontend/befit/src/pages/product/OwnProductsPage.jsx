import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {CustomLink} from "../../helpers/CustomLink";
import {jwtDecode} from "jwt-decode";

const OwnProductsPage = () => {
    const navigate = useNavigate();
    const [ownProducts, setOwnProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const productsPerPage = 5;

    useEffect(() => {
        const fetchOwnProducts = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const creatorUsername = decodedToken.sub;

                console.log("User username from token:", creatorUsername, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/product/user/${creatorUsername}`, {
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
                    setOwnProducts(data);
                } catch (error) {
                    console.error("Fetching own products failed: ", error);
                }
            }else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchOwnProducts();
    }, []);

    const handleRowClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(ownProducts.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-meals">All Meals</Link>
                <Link to="/">Log out</Link>
            </nav>
            <CustomLink to={"/add-product"}>Add Product</CustomLink>
            {ownProducts.length > 0 ? (
                <>
                    <nav>
                        <ul className="pagination">
                            {pageNumbers.map(number => (
                                <li key={number} className="page-item">
                                    <button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <table>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Kalorie</th>
                            <th>Białko</th>
                            <th>Tłuszcze</th>
                            <th>Węglowodany</th>
                            <th>Waga</th>
                            <th>ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ownProducts.map(product => (
                            <tr key={product.id} onClick={() => handleRowClick(product.id)}>
                                <td>{product.name}</td>
                                <td>{product.kcal}</td>
                                <td>{product.protein}</td>
                                <td>{product.fat}</td>
                                <td>{product.carbs}</td>
                                <td>{product.weight}</td>
                                <td>{product.creatorId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No own products available.</p>
            )}
        </div>
    );
};

export default OwnProductsPage;