import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/Product';
import Swal from 'sweetalert2';

const Products: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Category
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Price
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center space-x-4">
                    <Link
                      to={`/view-product/${product.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-150 ease-in-out"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-product/${product.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-150 ease-in-out"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No products found. Add some products to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
