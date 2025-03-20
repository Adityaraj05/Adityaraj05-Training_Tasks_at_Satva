import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/products" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-2" />
              Products
            </Link>
          </li>
          <li>
            <Link to="/add-product" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FontAwesomeIcon icon={faPlusCircle} className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
