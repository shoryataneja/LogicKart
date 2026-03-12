import { createContext, useContext, useState, useCallback } from "react";
import { getCart } from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(() => {
    if (!localStorage.getItem("token")) { setCartCount(0); return; }
    getCart()
      .then((r) => {
        const items = r.data.data?.items || [];
        setCartCount(items.reduce((s, i) => s + i.quantity, 0));
      })
      .catch(() => setCartCount(0));
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
