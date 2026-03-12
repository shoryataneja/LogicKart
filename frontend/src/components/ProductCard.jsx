import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import StarRating from "./StarRating";
import { addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const CATEGORY_EMOJI = {
  cubes:       "🧊",
  chess:       "♟️",
  "board games": "🎲",
  books:       "📚",
};

const ProductCard = ({ product }) => {
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const { refreshCart } = useCart();
  const { toast }       = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      refreshCart();
      toast({ message: `"${product.name}" added to cart!`, type: "success" });
    } catch {
      toast({ message: "Failed to add to cart", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock   = product.stock === 0;
  const hasDiscount    = product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  const emoji = CATEGORY_EMOJI[product.category?.toLowerCase()] || "🧩";

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="card group cursor-pointer flex flex-col overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative bg-white h-52 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-44 w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className={`absolute inset-0 items-center justify-center text-6xl select-none ${product.image ? "hidden" : "flex"}`}>
          {emoji}
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category pill */}
        <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        {product.brand && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</p>
        )}
        <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2">{product.name}</h3>

        <StarRating rating={product.rating || 4.0} count={product.numReviews} size={12} />

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-brand-500 font-bold text-base">
              ₹{discountedPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-xs line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 active:scale-95"
          >
            <ShoppingCart size={12} />
            {adding ? "..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
