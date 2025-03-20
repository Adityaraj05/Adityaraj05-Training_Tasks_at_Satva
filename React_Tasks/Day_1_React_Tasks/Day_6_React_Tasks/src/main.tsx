import { createRoot } from "react-dom/client";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import App from "./App.tsx";
import { ProductProvider } from "./Context/ProductContext/ProductWrapper.tsx";
import { CartProvider } from "./Context/CartContext/CartWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <ProductProvider>
    <CartProvider> 
      <App />
    </CartProvider>
  </ProductProvider>
);
