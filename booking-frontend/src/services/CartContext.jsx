import { createContext } from 'react';

export const CartContext = createContext({
    items: [],
    totalPrice: 0,
    totalItems: 0,
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {}
});