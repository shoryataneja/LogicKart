import { useState } from "react";
import { Package, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, getUserOrders } from "../services/api";
import { useToast } from "../context/ToastContext";
import useFetch from "../hooks/useFetch";
import Skeleton from "../components/Skeleton";

const STATUS_STYLES = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-600 border-red-200",
};

const TABS = [
  { id: "orders",  label: "My Orders",  icon: Package },
  { id: "profile", label: "Profile",    icon: UserIcon },
];

const Dashboard = () => {
  const { user, loginUser } = useAuth();
  const { toast }           = useToast();
  const { data: orders, loading: ordersLoading } = useFetch(getUserOrders);
  const [tab, setTab]       = useState("orders");
  const [form, setForm]     = useState({ name: user?.name || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      loginUser(localStorage.getItem("token"), res.data.data);
      toast({ message: "Profile updated!", type: "success" });
    } catch (err) {
      toast({ message: err.response?.data?.message || "Update failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-dark">{user?.name}</h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <span className="ml-auto text-xs font-semibold capitalize bg-brand-50 text-brand-500 border border-brand-100 px-3 py-1 rounded-full">
          {user?.role}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-white text-dark shadow-sm" : "text-gray-500 hover:text-dark"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="flex flex-col gap-4">
          {ordersLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-mono text-xs text-dark">{order._id}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">{item.product?.name || "Product"} × {item.quantity}</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="font-bold text-brand-500">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="card p-6 max-w-md">
          <h2 className="font-bold text-dark mb-5">Edit Profile</h2>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Role</label>
              <input value={user?.role} disabled className="input-field bg-gray-50 text-gray-400 capitalize cursor-not-allowed" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
