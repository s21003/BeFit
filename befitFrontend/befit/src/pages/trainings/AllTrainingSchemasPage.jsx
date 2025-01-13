import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {CustomLink} from "../../helpers/CustomLink";
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";

const AllTrainingSchemasPage = () => {
    const navigate = useNavigate();
    const [trainingSchemas, setTrainingSchemas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Corrected state declaration
    const trainingSchemasPerPage = 5;

    useEffect(() => {
        const fetchTrainingSchemas = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/trainingSchema/all`,{
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
                setTrainingSchemas(data);
            } catch (error) {
                console.error("Fetching trainingSchemas failed: ", error);
            }
        };
        fetchTrainingSchemas();
    }, []);

    const handleRowClick = (trainingSchemaId) => {
        navigate(`/training-schema/${trainingSchemaId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(trainingSchemas.length / trainingSchemasPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent the row click event from firing

        const token = localStorage.getItem("token");
        let trainingSchema;
        try{
            let response = await fetch(`http://localhost:8080/trainingSchema/${id}`,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            trainingSchema = await response.json();
        } catch (err){
            console.log(err);
        }

        try{
            let response = await fetch(`http://localhost:8080/trainingSchemaExercise/deleteSchema/${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }

        try{
            let response = await fetch(`http://localhost:8080/trainingSchema/delete`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(trainingSchema)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Training schema deleted successfully');
            setTrainingSchemas(trainingSchemas.filter(schema => schema.id !== id));

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="mainPage">
            <nav className="mainNavigation">
                <Link to="/all-training-schemas">All Training Schemas</Link>
                <Link to="/">Log out</Link>
            </nav>
            <CustomLink to="/add-training-schema">Add Schema</CustomLink>

            {trainingSchemas.length > 0 ? (
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
                            <th>Kategoria</th>
                            <th>Pochodzenie</th>
                            <th>Data utworzenia</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainingSchemas.map(trainingSchema => (
                            <tr key={trainingSchema.id} onClick={() => handleRowClick(trainingSchema.id)}>
                                <td>{trainingSchema.name}</td>
                                <td>{trainingSchema.category}</td>
                                <td>{trainingSchema.creatorUsername}</td>
                                <td>{trainingSchema.creationDate}</td>
                                <td className="actions">
                                    <BsFillTrashFill className="delete-btn" onClick={(e) => handleDelete(trainingSchema.id, e)}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No trainingSchemas available.</p>
            )}
        </div>
    );
};

export default AllTrainingSchemasPage;