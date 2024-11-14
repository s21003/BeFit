import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {CustomLink} from "../../helpers/CustomLink";

const AllProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const productsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/product/all`, {
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
                setProducts(data);
            } catch (error) {
                console.error("Fetching products failed: ", error);
            }
        };
        fetchProducts();
    }, []);

    const handleRowClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-products">All Products</Link>
                <Link to="/">Log out</Link>
            </nav>
            <CustomLink to={"/add-product"}>Add Product</CustomLink>
            {products.length > 0 ? (
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
                        {products.map(product => (
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
                <p>No products available.</p>
            )}
        </div>
    );
};

export default AllProductsPage;