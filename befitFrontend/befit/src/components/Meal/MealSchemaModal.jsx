import React, { useEffect, useState } from 'react';
import "../../styles/schema/SchemaModal.css";

export const MealSchemaModal = ({ closeModal, onSubmit, defaultValue }) => {
    const normalizeDefault = (data) => {
        if (!data) return null;
        const weight = data.weight || 0;
        return {
            productId: data.productId || 0,
            name: data.name || '',

            baseKcal: data.baseKcal !== undefined
                ? data.baseKcal
                : (data.kcal && weight ? data.kcal * 100 / weight : 0),
            baseProtein: data.baseProtein !== undefined
                ? data.baseProtein
                : (data.protein && weight ? data.protein * 100 / weight : 0),
            baseFat: data.baseFat !== undefined
                ? data.baseFat
                : (data.fat && weight ? data.fat * 100 / weight : 0),
            baseCarbs: data.baseCarbs !== undefined
                ? data.baseCarbs
                : (data.carbs && weight ? data.carbs * 100 / weight : 0),
            weight: weight
        };
    };

    const normalizedDefault = normalizeDefault(defaultValue);

    const initialFormState = normalizedDefault || {
        productId: 0,
        name: '',
        baseKcal: 0.0,
        baseProtein: 0.0,
        baseFat: 0.0,
        baseCarbs: 0.0,
        weight: 0.0
    };

    const [formState, setFormState] = useState(initialFormState);
    const [displayValues, setDisplayValues] = useState({ ...initialFormState });
    const [errors, setErrors] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (defaultValue) {
            const normalized = normalizeDefault(defaultValue);
            setFormState(normalized);
            setDisplayValues(normalized);
        }
    }, [defaultValue]);

    const validateForm = () => {
        if (formState.productId && formState.weight) {
            setErrors("");
            return true;
        } else {
            const errorFields = [];
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
        const { name, value } = e.target;
        const parsedValue = name === "weight" ? Number(value) : value;

        setFormState(prev => ({ ...prev, [name]: parsedValue }));
        setDisplayValues(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleProductChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedProduct = products.find((product) => product.id === selectedId);

        if (selectedProduct) {
            const currentWeight = Number(formState.weight) || 0;
            const newState = {
                ...formState,
                productId: selectedProduct.id,
                name: selectedProduct.name,
                baseKcal: selectedProduct.kcal,
                baseProtein: selectedProduct.protein,
                baseFat: selectedProduct.fat,
                baseCarbs: selectedProduct.carbs,
                weight: currentWeight
            };
            setFormState(newState);
            setDisplayValues(newState);
        } else {
            console.log("No product found with that ID.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const calculatedValues = {
            kcal: formState.baseKcal * formState.weight / 100,
            protein: formState.baseProtein * formState.weight / 100,
            fat: formState.baseFat * formState.weight / 100,
            carbs: formState.baseCarbs * formState.weight / 100
        };

        const finalFormState = { ...formState, ...calculatedValues };

        onSubmit(finalFormState);
        console.log("finalFormState", finalFormState);
        closeModal();
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
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
                console.error("Fetching products failed:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="schema-modal-container" onClick={(e) => {
            if (e.target.className === "modal-container") closeModal();
        }}>
            <div className="schema-modal">
                <form>
                    <div className="schema-modal-form-group">
                        <label htmlFor="product">Produkt</label>
                        <select
                            name="product"
                            value={formState.productId || ''}
                            onChange={handleProductChange}
                        >
                            <option value="" disabled>Wybierz produkt</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="schema-modal-form-group">
                        <label htmlFor="weight">Planowana waga produktu</label>
                        <input
                            type="number"
                            name="weight"
                            value={formState.weight}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>kalorie:</label>
                        {Math.round((formState.baseKcal * formState.weight) / 100)}
                    </div>
                    {errors && <div>{`Missing: ${errors}`}</div>}
                    <div className="schema-modal-buttons-container">
                        <button type="submit" className="schema-modal-save-btn" onClick={handleSubmit}>
                            Zapisz
                        </button>
                        <button className="schema-modal-cancel-btn" onClick={closeModal}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
