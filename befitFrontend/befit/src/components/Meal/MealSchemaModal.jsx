import React, { useEffect, useState } from 'react';
import "../../styles/schema/SchemaModal.css";

export const MealSchemaModal = ({ closeModal, onSubmit, defaultValue }) => {
    // Normalize the default value:
    // If base nutrient values are not provided, calculate them from the computed ones.
    const normalizeDefault = (data) => {
        if (!data) return null;
        const weight = data.weight || 0;
        return {
            productId: data.productId || 0,
            name: data.name || '',
            // If baseKcal is defined, use it; otherwise, compute it using computed kcal.
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

    // Initialize state with normalized defaults (or fallback if none provided)
    const initialFormState = normalizedDefault || {
        productId: 0,
        name: '',
        baseKcal: 0.0,      // Base kcal per 100g
        baseProtein: 0.0,   // Base protein per 100g
        baseFat: 0.0,       // Base fat per 100g
        baseCarbs: 0.0,     // Base carbs per 100g
        weight: 0.0         // Planned weight
    };

    const [formState, setFormState] = useState(initialFormState);
    // We'll use displayValues to show computed numbers (if needed).
    const [displayValues, setDisplayValues] = useState({ ...initialFormState });
    const [errors, setErrors] = useState("");
    const [products, setProducts] = useState([]);

    // Update state when defaultValue changes.
    useEffect(() => {
        if (defaultValue) {
            const normalized = normalizeDefault(defaultValue);
            setFormState(normalized);
            setDisplayValues(normalized);
        }
    }, [defaultValue]);

    const validateForm = () => {
        // Check that productId and weight are truthy (non-zero)
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

    // Update form state when inputs change.
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Here only weight is expected to be changed.
        const parsedValue = name === "weight" ? Number(value) : value;

        setFormState(prev => ({ ...prev, [name]: parsedValue }));
        setDisplayValues(prev => ({ ...prev, [name]: parsedValue }));
    };

    // When selecting a product, update the product-related fields while preserving the current weight.
    const handleProductChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedProduct = products.find((product) => product.id === selectedId);

        if (selectedProduct) {
            const currentWeight = Number(formState.weight) || 0;
            const newState = {
                ...formState,
                productId: selectedProduct.id,
                name: selectedProduct.name,
                baseKcal: selectedProduct.kcal,       // base kcal per 100g
                baseProtein: selectedProduct.protein,   // base protein per 100g
                baseFat: selectedProduct.fat,           // base fat per 100g
                baseCarbs: selectedProduct.carbs,       // base carbs per 100g
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

        // Calculate final (computed) values using the base nutrient values.
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

    // Fetch products when the component loads.
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
