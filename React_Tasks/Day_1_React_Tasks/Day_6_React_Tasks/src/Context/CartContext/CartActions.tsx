type CartAction =
    | { type: "ADD_TO_CART"; payload: number } // Store only product ID
    | { type: "REMOVE_FROM_CART"; payload: number }
    | { type: "UPDATE_QUANTITY"; payload: { id: number; change: number } }
    | { type: "CLEAR_CART" };

export const CartReducer = (
    state: { products: { id: number; quantity: number }[] },
    action: CartAction
) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existingItem = state.products.find(item => item.id === action.payload);
            let updatedProducts;

            if (existingItem) {
                updatedProducts = state.products.map(item =>
                    item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedProducts = [...state.products, { id: action.payload, quantity: 1 }];
            }

            return { ...state, products: updatedProducts };
        }

        case "REMOVE_FROM_CART": {
            const updatedProducts = state.products.filter(item => item.id !== action.payload);
            return { ...state, products: updatedProducts };
        }

        case "UPDATE_QUANTITY": {
            const updatedProducts = state.products.map(item =>
                item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.change } : item
            ).filter(item => item.quantity > 0);

            return { ...state, products: updatedProducts };
        }

        case "CLEAR_CART":
            return { products: [] };

        default:
            return state;
    }
};
