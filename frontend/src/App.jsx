import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar            from "./components/Navbar";
import ProtectedRoute    from "./components/ProtectedRoute";
import Home              from "./pages/Home";
import ProductDetail     from "./pages/ProductDetail";
import Cart              from "./pages/Cart";
import Checkout          from "./pages/Checkout";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import Dashboard         from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/products/:id"      element={<ProductDetail />} />
              <Route path="/login"             element={<Login />} />
              <Route path="/signup"            element={<Signup />} />
              <Route path="/cart"              element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout/:orderId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/dashboard"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
