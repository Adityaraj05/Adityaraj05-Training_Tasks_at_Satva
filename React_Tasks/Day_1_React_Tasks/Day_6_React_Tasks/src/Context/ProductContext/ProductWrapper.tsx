import { createContext, useContext, useReducer } from "react";
import { productReducer } from "./ProductActions";

export type ProductType = {
    id?: number;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    quantity:number;
};

type ProductContextType = {
    products: ProductType[];
    addProduct: (product: ProductType) => void;
    updateProduct: (product: ProductType) => void;
    deleteProduct: (id: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, dispatch] = useReducer(productReducer, []);

    const addProduct = (product: ProductType) => {
        dispatch({ type: "ADD_PRODUCT", payload: product });
    };

    const updateProduct = (product: ProductType) => {
        dispatch({ type: "UPDATE_PRODUCT", payload: product });
    };

    const deleteProduct = (id: number) => {
        dispatch({ type: "DELETE_PRODUCT", payload: id });
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
};
