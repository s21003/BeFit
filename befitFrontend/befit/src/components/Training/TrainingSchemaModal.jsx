import React, { useEffect, useState } from 'react';
import "../../styles/schema/SchemaModal.css";
import {jwtDecode} from "jwt-decode";

export const TrainingSchemaModal = ({ closeModal, onSubmit, defaultValue }) => {
    const [formState, setFormState] = useState(
        defaultValue || {
            exerciseId: 0,
            name: '',
            part: '',
            videoLink: '',
            series: 0.0,
            repeatNumber: 0.0,
            weight: 0.0
        }
    );

    const [errors, setErrors] = useState("");
    const [exercises, setExercises] = useState([]);

    const validateForm = () => {
        if (formState.exerciseId && formState.series && formState.repeatNumber && formState.weight) {
            setErrors("");
            return true;
        } else {
            let errorFields = [];
            for (const [key, value] of Object.entries(formState)) {
                if (!value) {
                    errorFields.push(key);
                }
            }
            setErrors(errorFields.join(", "));
            return false;
        }
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleExerciseChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedExercise = exercises.find((exercise) => exercise.id === selectedId);
        setFormState({
            ...formState,
            exerciseId: selectedExercise.id,
            name: selectedExercise.name,
            part: selectedExercise.part,
            videoLink: selectedExercise.videoLink,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(formState);
        closeModal();
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const token = localStorage.getItem("token");
                const decodedtoken = jwtDecode(token)
                const response = await fetch(`http://localhost:8080/exercise/all/${decodedtoken.sub}`, {
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
                setExercises(data);
            } catch (error) {
                console.error("Fetching exercises failed:", error);
            }
        };
        fetchExercises();
    }, []);

    return (
        <div className="schema-modal-container" onClick={(e) => {
            if (e.target.className === "schema-modal-container") closeModal();
        }}>
            <div className="schema-modal">
                <form>
                    <div className="schema-modal-form-group">
                        <label htmlFor="exercise">Ćwiczenie</label>
                        <select
                            name="exercise"
                            value={formState.exerciseId || ''}
                            onChange={handleExerciseChange}
                        >
                            <option value="" disabled>Wybierz ćwiczenie</option>
                            {exercises.map((exercise) => (
                                <option key={exercise.id} value={exercise.id}>
                                    {exercise.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="schema-modal-form-group">
                        <label htmlFor="series">Planowana liczba serii</label>
                        <input type="number" name="series" value={formState.series} onChange={handleChange} />
                    </div>
                    <div className="schema-modal-form-group">
                        <label htmlFor="repeatNumber">Planowana liczba powtórzeń w serii</label>
                        <input type="number" name="repeatNumber" value={formState.repeatNumber} onChange={handleChange} />
                    </div>
                    <div className="schema-modal-form-group">
                        <label htmlFor="weight">Planowana waga w serii</label>
                        <input type="number" name="weight" value={formState.weight} onChange={handleChange} />
                    </div>
                    {errors && <div>{`Missing: ${errors}`}</div>}
                    <button type="submit" className="schema-modal-save-btn" onClick={handleSubmit}>Zapisz</button>
                </form>
            </div>
        </div>
    );
};
