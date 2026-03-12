import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, ArrowLeft, Shield, RotateCcw, Truck } from "lucide-react";
import { getProductById, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/StarRating";
import Skeleton from "../components/Skeleton";

const PERKS = [
  { icon: Truck,      label: "Free Delivery", sub: "On orders above ₹499" },
  { icon: RotateCcw,  label: "Easy Returns",  sub: "7-day return policy" },
  { icon: Shield,     label: "Secure Payment", sub: "100% safe checkout" },
];

const ProductDetail = () => {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const { refreshCart } = useCart();
  const { toast }       = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [adding, setAdding]   = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((r) => setProduct(r.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async (redirect = false) => {
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    try {
      await addToCart({ productId: id, quantity: qty });
      refreshCart();
      toast({ message: "Added to cart!", type: "success" });
      if (redirect) navigate("/cart");
    } catch {
      toast({ message: "Failed to add to cart", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <Skeleton className="h-96 rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );

  if (!product) return <p className="text-center text-red-500 mt-20">Product not found.</p>;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="card bg-white p-6 flex items-center justify-center h-96 border border-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
            />
          ) : null}
          <span className={`text-9xl ${product.image ? "hidden" : "block"}`}>🧩</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-widest">{product.category}</span>
          <h1 className="text-2xl font-bold text-dark leading-snug">{product.name}</h1>

          {product.brand && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider -mt-2">{product.brand}</p>
          )}

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating || 4.0} count={product.numReviews} size={15} />
            {product.numReviews > 0 && (
              <span className="text-xs text-gray-400">{product.numReviews.toLocaleString()} reviews</span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-3xl font-extrabold text-brand-500">
                  ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {product.discount}% off
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-brand-500">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className={`text-sm font-medium ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
            {isOutOfStock ? "Out of Stock" : `✓ In Stock (${product.stock} left)`}
          </p>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{product.description}</p>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors">−</button>
                <span className="px-4 py-2 text-sm font-semibold border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors">+</button>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3 mt-2">
            <button onClick={() => handleAddToCart(false)} disabled={isOutOfStock || adding}
              className="flex-1 btn-outline flex items-center justify-center gap-2">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={() => handleAddToCart(true)} disabled={isOutOfStock || adding}
              className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Zap size={16} /> Buy Now
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3 mt-2 pt-4 border-t border-gray-100">
            {PERKS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon size={18} className="text-brand-500" />
                <span className="text-xs font-semibold text-dark">{label}</span>
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
