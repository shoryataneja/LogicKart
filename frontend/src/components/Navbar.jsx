import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logoutUser }    = useAuth();
  const { cartCount, refreshCart } = useCart();
  const navigate                = useNavigate();
  const [search, setSearch]     = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef                 = useRef(null);

  useEffect(() => { refreshCart(); }, [user, refreshCart]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logoutUser();
    setDropOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="text-white font-bold text-xl tracking-tight shrink-0">
          Logic<span className="text-brand-500">Kart</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
          <div className="flex w-full rounded-lg overflow-hidden border border-white/10 focus-within:border-brand-500 transition-colors">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories..."
              className="flex-1 bg-white/10 text-white placeholder-white/40 px-4 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-brand-500 hover:bg-brand-600 px-4 flex items-center transition-colors">
              <Search size={16} className="text-white" />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-white/80 hover:text-white transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden md:block">{user.name?.split(" ")[0]}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-dark truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen((o) => !o)} className="sm:hidden text-white/80 hover:text-white p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-3 bg-dark border-t border-white/10 animate-fade-in">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden border border-white/10 mt-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-white/10 text-white placeholder-white/40 px-4 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-brand-500 px-4 flex items-center">
              <Search size={16} className="text-white" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
