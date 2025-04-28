import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { fetchMovieDetails } from "@/services/api";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      localStorage.removeItem("cart");
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      calculateTotal();
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (cartItems.length === 0) {
        setCartDetails([]);
        return;
      }

      try {
        const detailsPromises = cartItems.map(async (item) => {
          // Only fetch if we need updated info
          try {
            const details = await fetchMovieDetails(item.id);
            return {
              ...item,
              title: details.title, // Update title with translated version
              poster_path: details.poster_path || item.poster_path,
            };
          } catch (error) {
            console.error(
              `Failed to fetch details for movie ${item.id}`,
              error
            );
            return item; // Return original item if fetch fails
          }
        });

        const details = await Promise.all(detailsPromises);
        setCartDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (isInitialized && cartItems.length > 0) {
      fetchDetails();
    }
  }, [cartItems, i18n.language, isInitialized]); // React to language changes

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

    let discountAmount = 0;
    if (cartItems.length >= 5) {
      discountAmount = subtotal * 0.2;
    } else if (cartItems.length >= 3) {
      discountAmount = subtotal * 0.1;
    }

    const finalAmount = subtotal - discountAmount;

    setTotalPrice(subtotal);
    setDiscount(discountAmount);
    setFinalPrice(finalAmount);
  };

  const addToCart = (movie) => {
    const existingItem = cartItems.find((item) => item.id === movie.id);

    if (!existingItem) {
      setCartItems([
        ...cartItems,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          price: movie.price,
        },
      ]);
    }
  };

  const removeFromCart = (movieId) => {
    const updatedCart = cartItems.filter((item) => item.id !== movieId);
    setCartItems(updatedCart);

    if (cartDetails.length > 0) {
      setCartDetails(cartDetails.filter((item) => item.id !== movieId));
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    calculateTotal();

    toast.success(t("Removed from Cart"));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartDetails([]);
    localStorage.removeItem("cart");

    setTotalPrice(0);
    setDiscount(0);
    setFinalPrice(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cartDetails.length > 0 ? cartDetails : cartItems,
        rawCartItems: cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        discount,
        finalPrice,
        itemCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
