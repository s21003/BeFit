import React, { useEffect, useState } from 'react';
import "../../styles/Modal.css";

export const MealSchemaModal = ({ closeModal, onSubmit, defaultValue }) => {
    const [formState, setFormState] = useState(
        defaultValue || {
            productId: 0,
            name: '',
            kcal: 0.0,
            protein: 0.0,
            fat: 0.0,
            carbs: 0.0,
            weight: 0.0
        }
    );

    const [errors, setErrors] = useState("");
    const [products, setProducts] = useState([]);

    const validateForm = () => {
        if (formState.productId && formState.weight) {
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

    const handleProductChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedProduct = products.find((product) => product.id === selectedId);
        setFormState({
            ...formState,
            productId: selectedProduct.id,
            name: selectedProduct.name,
            kcal: selectedProduct.kcal,
            protein: selectedProduct.protein,
            fat: selectedProduct.fat,
            carbs: selectedProduct.carbs,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        formState.kcal = formState.kcal*formState.weight/100;
        formState.protein = formState.protein*formState.weight/100;
        formState.fat = formState.fat*formState.weight/100;
        formState.carbs = formState.carbs*formState.weight/100;

        onSubmit(formState);
        console.log("form state", formState);
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
        <div className="modal-container" onClick={(e) => {
            if (e.target.className === "modal-container") closeModal();
        }}>
            <div className="modal">
                <form>
                    <div className="form-group">
                        <label htmlFor="product">Product</label>
                        <select
                            name="product"
                            value={formState.productId || ''}
                            onChange={handleProductChange}
                        >
                            <option value="" disabled>Select an product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>

                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Planned weight of product</label>
                        <input type="number" name="weight" value={formState.weight} onChange={handleChange} />
                    </div>
                    <div>
                        {(formState.kcal*formState.weight)/100}
                    </div>
                    {/*{errors && <div className="error" >{`Missing: ${errors}`}</div>}*/}
                    {errors && <div>{`Missing: ${errors}`}</div>}
                    <button type="submit" className="btn" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};
