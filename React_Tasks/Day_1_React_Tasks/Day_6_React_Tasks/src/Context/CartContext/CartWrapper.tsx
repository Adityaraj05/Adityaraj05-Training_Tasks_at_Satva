import { createContext, useContext, useReducer, ReactNode } from "react";
import { CartReducer } from "./CartActions";
import { useProductContext } from "../ProductContext/ProductWrapper";

export type CartItemType = { id: number; quantity: number }; 

export type CartType = {
    products: CartItemType[];
};

export type CartContextType = {
    cart: CartType;
    total: number; 
    addToCart: (id: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { products } = useProductContext(); 
    const [cart, dispatch] = useReducer(CartReducer, { products: [] });
    const total = cart.products.reduce((sum, cartItem) => {
        const product = products.find(p => p.id === cartItem.id);
        return product ? sum + product.price * cartItem.quantity : sum;
    }, 0);

    const addToCart = (id: number) => {
        dispatch({ type: "ADD_TO_CART", payload: id });
    };

    const removeFromCart = (id: number) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const increaseQuantity = (id: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, change: 1 } });
    };

    const decreaseQuantity = (id: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, change: -1 } });
    };

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
};
