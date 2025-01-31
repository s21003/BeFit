import React from 'react';
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import "../../styles/SchemaTable.css"

export const TrainingSchemaTable = ({ rows, deleteRow, editRow }) => {
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    <th>Nazwa ćwiczenia</th>
                    <th>Paria ciała</th>
                    <th>Planowana liczba serii</th>
                    <th>Planowana liczba powtórzeń w serii</th>
                    <th>Planowana waga w serii</th>
                    <th>Link do wideo</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {
                    rows.map((row, id) => {
                        return (<tr key={id}>
                                <td>{row.name}</td>
                                <td>{row.part}</td>
                                <td>{row.series}</td>
                                <td>{row.repeatNumber}</td>
                                <td>{row.weight}</td>
                                <td>{row.videoLink}</td>
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