import React, { useEffect, useState } from 'react';
import "../../styles/Modal.css";

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
                const response = await fetch(`http://localhost:8080/exercise/all`, {
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
        <div className="modal-container" onClick={(e) => {
            if (e.target.className === "modal-container") closeModal();
        }}>
            <div className="modal">
                <form>
                    <div className="form-group">
                        <label htmlFor="exercise">Exercise</label>
                        <select
                            name="exercise"
                            value={formState.exerciseId || ''}
                            onChange={handleExerciseChange}
                        >
                            <option value="" disabled>Select an exercise</option>
                            {exercises.map((exercise) => (
                                <option key={exercise.id} value={exercise.id}>
                                    {exercise.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="series">Planned number of Series</label>
                        <input type="number" name="series" value={formState.series} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="repeatNumber">Planned number of repetitions in a series</label>
                        <input type="number" name="repeatNumber" value={formState.repeatNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Planned weight in a series</label>
                        <input type="number" name="weight" value={formState.weight} onChange={handleChange} />
                    </div>
                    {/*{errors && <div className="error" >{`Missing: ${errors}`}</div>}*/}
                    {errors && <div>{`Missing: ${errors}`}</div>}
                    <button type="submit" className="btn" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};
