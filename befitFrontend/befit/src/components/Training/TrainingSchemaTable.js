import React from 'react';
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import '../../styles/Table.css'


export const TrainingSchemaTable = ({ rows, deleteRow, editRow }) => {
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    <th>Exercise's name</th>
                    <th>Body part</th>
                    <th>Planned number of series</th>
                    <th>Planned repetitions in a series</th>
                    <th>Planned weight in a series</th>
                    <th>Link to video</th>
                    <th>Actions</th>
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