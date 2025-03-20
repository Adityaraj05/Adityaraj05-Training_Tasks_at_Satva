import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/Product';
import Swal from 'sweetalert2';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
    };

    setProducts([...products, newProduct]);
    navigate('/products');

    // Show SweetAlert after adding product
    Swal.fire({
      icon: 'success',
      title: 'Product Added',
      text: 'The product was successfully added!',
      confirmButtonText: 'Okay',
    });
  }, [products, setProducts, navigate]);

  return (
    <div>
      <h2 className="text-2xl  font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">Name  <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description  <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price  <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            required
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category  <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="category"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
