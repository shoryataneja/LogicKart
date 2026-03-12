import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { getCart, updateCartItem, removeCartItem, createOrder } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Skeleton from "../components/Skeleton";

const Cart = () => {
  const [cart, setCart]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { refreshCart }     = useCart();
  const { toast }           = useToast();
  const navigate            = useNavigate();

  const fetchCart = () =>
    getCart().then((r) => setCart(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { fetchCart(); }, []);

  const handleUpdate = async (pid, qty) => {
    await updateCartItem(pid, qty);
    fetchCart(); refreshCart();
  };

  const handleRemove = async (pid) => {
    await removeCartItem(pid);
    fetchCart(); refreshCart();
    toast({ message: "Item removed", type: "success" });
  };

  const handleCheckout = async () => {
    setPlacing(true);
    try {
      const res = await createOrder();
      refreshCart();
      navigate(`/checkout/${res.data.data._id}`);
    } catch {
      toast({ message: "Checkout failed. Try again.", type: "error" });
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col gap-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );

  const items = cart?.items?.filter((i) => i.product) || [];
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = subtotal > 499 ? 0 : 49;
  const total     = subtotal + shipping;

  if (items.length === 0) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center animate-fade-in">
      <ShoppingBag size={56} className="text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-dark mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        Start Shopping <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-6">Shopping Cart <span className="text-gray-400 font-normal text-base">({items.length} items)</span></h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.product._id} className="card p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.product.image
                  ? <img src={item.product.image} alt={item.product.name} className="h-full object-contain p-1" />
                  : <span className="text-3xl">🧩</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark text-sm truncate">{item.product.name}</p>
                <p className="text-brand-500 font-bold mt-0.5">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                <button onClick={() => handleUpdate(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}
                  className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors text-sm">−</button>
                <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200">{item.quantity}</span>
                <button onClick={() => handleUpdate(item.product._id, item.quantity + 1)}
                  className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors text-sm">+</button>
              </div>
              <p className="font-bold text-dark w-20 text-right shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => handleRemove(item.product._id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-bold text-dark mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Add ₹{499 - subtotal} more for free shipping</p>
            )}
            <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-dark text-base">
              <span>Total</span>
              <span className="text-brand-500">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={placing}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2">
            {placing ? "Processing..." : <><span>Proceed to Checkout</span><ArrowRight size={16} /></>}
          </button>
          <Link to="/" className="block text-center text-xs text-gray-400 hover:text-brand-500 mt-3 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
