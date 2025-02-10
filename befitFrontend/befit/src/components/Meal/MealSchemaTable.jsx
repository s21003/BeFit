import React from 'react';
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import "../../styles/schema/SchemaTable.css"

export const MealSchemaTable = ({ rows, deleteRow, editRow, isShared }) => {

    return (
        <div className="schema-table-wrapper">
            <table className="schema-table">
                <thead>
                <tr>
                    <th>Nazwa produktu</th>
                    <th>Kalorie</th>
                    <th>Białko</th>
                    <th>Tłuszcze</th>
                    <th>Węglowodany</th>
                    <th>Waga</th>
                    {isShared ? (
                        <></>
                        ) : (
                            <th>Akcje</th>
                    )}
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
                                {isShared ? (
                                    <></>
                                ) : (
                                    <td>
                                        <span className="schema-actions">
                                            <BsFillTrashFill className="schema-delete-btn" onClick={() => deleteRow(id)}/>
                                            <BsFillPencilFill onClick={() => editRow(id)}/>
                                        </span>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}