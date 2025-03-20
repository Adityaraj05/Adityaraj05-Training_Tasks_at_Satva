import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/Product';

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [products] = useLocalStorage<Product[]>('products', []);
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="mb-2"><strong>Category:</strong> {product.category}</p>
        <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
        <p className="mb-4"><strong>Description:</strong> {product.description}</p>
        <Link
          to="/products"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ViewProduct;