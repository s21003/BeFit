import React from 'react';
import {BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import "../../styles/schema/SchemaTable.css"

export const TrainingSchemaTable = ({ rows, deleteRow, editRow, isShared }) => {
    const handleVideoClick = (videoLink) => {
        if (videoLink) {
            window.open(videoLink, "_blank");
        }
    };
    return (
        <div className="schema-table-wrapper">
            <table className="schema-table">
                <thead>
                <tr>
                    <th>Nazwa ćwiczenia</th>
                    <th>Paria ciała</th>
                    <th>Planowana liczba serii</th>
                    <th>Planowana liczba powtórzeń w serii</th>
                    <th>Planowana waga w serii</th>
                    <th>Link do wideo</th>
                    {!isShared ? (
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
                                <td>{row.part}</td>
                                <td>{row.series}</td>
                                <td>{row.repeatNumber}</td>
                                <td>{row.weight}</td>
                                <td>
                                    {row.videoLink ? (
                                        <button
                                            className="btn-video"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVideoClick(row.videoLink);
                                            }}
                                        >
                                            Zobacz wideo
                                        </button>
                                    ) : null}
                                </td>

                                {!isShared ? (
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