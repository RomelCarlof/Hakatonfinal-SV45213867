import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/cart', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setCart(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Shopping Cart</h1>
            <div>
                {cart.map(item => (
                    <div key={item.productId}>
                        <h2>{item.productName}</h2>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cart;
