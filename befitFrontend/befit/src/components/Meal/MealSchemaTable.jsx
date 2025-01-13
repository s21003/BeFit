import React from 'react';
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import '../../styles/Table.css'


export const MealSchemaTable = ({ rows, deleteRow, editRow }) => {
    console.log("rows: "+rows)

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    <th>Product's name</th>
                    <th>Kcal</th>
                    <th>Protein</th>
                    <th>Fat</th>
                    <th>Carbs</th>
                    <th>Weight</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    rows.map((row, id) => {
                        return (<tr key={id}>
                                <td>{row.name}</td>
                                <td>{row.kcal}</td>
                                <td>{row.protein}</td>
                                <td>{row.fat}</td>
                                <td>{row.carbs}</td>
                                <td>{row.weight}</td>
                                <td>
                                <span className="actions">
                                    <BsFillTrashFill className="delete-btn" onClick={() => deleteRow(id)}/>
                                    <BsFillPencilFill onClick={() => editRow(id)}/>
                                </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}