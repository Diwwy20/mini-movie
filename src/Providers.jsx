import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";

const Providers = ({ children }) => {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
};

export default Providers;
