import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Lock } from "lucide-react";
import { getOrderById, mockPayment } from "../services/api";
import { useToast } from "../context/ToastContext";
import Skeleton from "../components/Skeleton";

const Checkout = () => {
  const { orderId }     = useParams();
  const navigate        = useNavigate();
  const { toast }       = useToast();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying]   = useState(false);
  const [paid, setPaid]       = useState(false);

  useEffect(() => {
    getOrderById(orderId)
      .then((r) => setOrder(r.data.data))
      .catch(() => { toast({ message: "Order not found", type: "error" }); navigate("/"); })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      await mockPayment(orderId);
      setPaid(true);
    } catch {
      toast({ message: "Payment failed. Please try again.", type: "error" });
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );

  if (paid) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center animate-slide-up">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-dark mb-2">Payment Successful!</h2>
      <p className="text-gray-500 text-sm mb-8">Your order has been placed and is being processed.</p>
      <button onClick={() => navigate("/dashboard")} className="btn-primary">
        View My Orders
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-6">Checkout</h1>

      {/* Order items */}
      <div className="card divide-y divide-gray-100 mb-4">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium text-sm text-dark">{item.product?.name || "Product"}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-brand-500">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Summary + Pay */}
      <div className="card p-6">
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total Amount</span>
          <span className="text-brand-500">₹{order.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-5">
          <Lock size={16} className="shrink-0 mt-0.5" />
          <span>This is a <strong>mock payment</strong>. No real transaction will occur. Click below to simulate a successful payment.</span>
        </div>
        <button onClick={handlePayment} disabled={paying} className="btn-primary w-full flex items-center justify-center gap-2">
          <Lock size={15} />
          {paying ? "Processing..." : `Pay ₹${order.totalAmount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
