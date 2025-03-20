import { createBrowserRouter } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import PrivateRoute from "./PrivateRoute";
import { Products } from "../pages/Products/Products";
import { AddEditProduct } from "../pages/Products/AddEditProduct";
import { ViewProduct } from "../pages/Products/ViewProduct";
import { Cart } from "../pages/Products/Cart";
import { AllProducts } from "../pages/Products/AllProducts";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Auth />
    },
    {
        path: "/dashboard",
        element: <PrivateRoute />,
        children: [
            {
                path: "",
                element: <Dashboard />,
                children: [
                    { index: true, element: <Products /> },
                    { path: "products", element: <AllProducts /> },
                    { path: "products/add-product", element: <AddEditProduct /> },
                    { path: "products/view-product/:id", element: <ViewProduct /> },
                    { path: "products/edit-product/:id", element: <AddEditProduct /> },
                    { path: "cart", element: <Cart /> }
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />
    }
]);
