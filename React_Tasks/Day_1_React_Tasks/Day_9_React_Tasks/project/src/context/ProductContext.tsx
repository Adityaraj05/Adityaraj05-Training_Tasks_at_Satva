import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: uuidv4(),
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      stock: 15,
      description: 'High-performance laptop with the latest processor',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Smartphone X',
      category: 'Electronics',
      price: 899.99,
      stock: 25,
      description: 'Latest smartphone with advanced camera features',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      category: 'Audio',
      price: 199.99,
      stock: 30,
      description: 'Noise-cancelling wireless headphones with long battery life',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Smart Watch',
      category: 'Wearables',
      price: 249.99,
      stock: 20,
      description: 'Fitness tracking smartwatch with heart rate monitor',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Tablet Mini',
      category: 'Electronics',
      price: 399.99,
      stock: 18,
      description: 'Compact tablet with high-resolution display',
      createdAt: new Date(),
    },
  ]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};