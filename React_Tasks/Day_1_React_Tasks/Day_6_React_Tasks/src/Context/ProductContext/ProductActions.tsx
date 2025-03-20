import { ProductType } from "./ProductWrapper";

export type ProductActionType = { type: "ADD_PRODUCT"; payload: ProductType } | { type: "UPDATE_PRODUCT"; payload: ProductType }
    | { type: "DELETE_PRODUCT"; payload: number }
    | { type: "SET_PRODUCTS"; payload: ProductType[] };

export const productReducer = (state: ProductType[], action: ProductActionType) => {
    switch (action.type) {
        case "ADD_PRODUCT":
            return [...state, { ...action.payload, id: Date.now() }];
        case "UPDATE_PRODUCT":
            return state.map((product) =>
                product.id === action.payload.id ? action.payload : product
            );
        case "DELETE_PRODUCT":
            return state.filter((product) => product.id !== action.payload);
        default:
            return state;
    }
};
