import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const calculatedTotalPrice = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const calculatedTotalItems = items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        setTotalPrice(calculatedTotalPrice);
        setTotalItems(calculatedTotalItems);
    }, [items]);

    const addToCart = (newItem) => {
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.eventId === newItem.eventId && item.type === newItem.type
            );

            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
                };
                return updatedItems;
            } else {
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (itemId, itemType) => {
        setItems(prevItems =>
            prevItems.filter(item => !(item.eventId === itemId && item.type === itemType))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{
            items,
            totalPrice,
            totalItems,
            addToCart,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};