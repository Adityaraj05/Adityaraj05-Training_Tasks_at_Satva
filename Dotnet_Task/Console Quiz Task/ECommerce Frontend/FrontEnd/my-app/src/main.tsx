import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginForm from './Components/LoginForm'
import RegistrationForm from './Components/RegistrationForm'
import ProtectedRoute from './Middleware/ProtectedRoute'
import App from './App'
import '@ant-design/v5-patch-for-react-19';
import SupplierList from './Pages/SupplierList'
import ProductList from './Pages/ProductList'
import CustomerList from './Pages/CustomerList'
import OrderList from './Pages/OrderList'
import Dashboard from './Pages/Dashboard'
import HomePage from './Pages/HomePage'
import Orders from './Pages/Orders'
import CartPage from './Pages/CartPage'
import Invoices from './Pages/Invoices'


export const router = createBrowserRouter([
  { path: '/', element: <LoginForm /> },
  { path: '/login', element: <LoginForm /> },
  { path: '/register', element: <RegistrationForm /> },
  {
    path: '/app',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> }, 
      { path: 'suppliers', element: <SupplierList /> },
      { path: 'product-list', element: <ProductList /> },
      { path: 'customer-list', element: <CustomerList /> },
      { path: 'order-list', element: <OrderList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'home', element: <HomePage /> },
      { path: 'orders', element: <Orders /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'invoices', element: <Invoices /> },
    ]
  }
  
]);


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
