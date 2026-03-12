import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, ArrowRight } from "lucide-react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";

const CATEGORIES = ["All", "Cubes", "Chess", "Board Games", "Books"];

const CATEGORY_META = {
  Cubes:        { emoji: "🧊", desc: "Speed cubes, magnetic cubes & more", color: "from-blue-500 to-cyan-400" },
  Chess:        { emoji: "♟️", desc: "Wooden sets, magnetic & electronic boards", color: "from-amber-600 to-yellow-400" },
  "Board Games":{ emoji: "🎲", desc: "Strategy, cooperative & party games", color: "from-purple-500 to-pink-400" },
  Books:        { emoji: "📚", desc: "Math, logic, puzzles & algorithms", color: "from-green-500 to-emerald-400" },
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("default");
  const [searchParams]          = useSearchParams();
  const searchQuery             = searchParams.get("q") || "";

  useEffect(() => {
    getProducts()
      .then((r) => setProducts(r.data.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }
    if (category !== "All") result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating")     result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [products, category, sort, searchQuery]);

  // Group products by category for the showcase sections
  const byCategory = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [products]);

  const isFiltering = searchQuery || category !== "All";

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dark via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-brand-500/20 text-brand-500 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-brand-500/30">
              🧠 Learn Through Play
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Sharpen Your Mind<br />
              <span className="text-brand-500">One Puzzle at a Time</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Premium speed cubes, chess sets, strategy games, and math books — everything for the logical mind.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#products" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 active:scale-95">
                Shop Now
              </a>
              <a href="#categories" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200">
                Browse Categories
              </a>
            </div>
          </div>
          {/* Floating emoji tiles */}
          <div className="hidden md:grid grid-cols-2 gap-4 shrink-0">
            {[["🧊","Speed Cubes"],["♟️","Chess"],["🎲","Board Games"],["📚","Books"]].map(([e, label], i) => (
              <div key={i} className={`w-28 h-28 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors flex flex-col items-center justify-center gap-2 cursor-default ${i % 2 === 1 ? "mt-6" : ""}`}>
                <span className="text-4xl">{e}</span>
                <span className="text-white/60 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ────────────────────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-dark mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_META).map(([cat, { emoji, desc, color }]) => (
            <button key={cat} onClick={() => { setCategory(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
              className="card p-5 text-left hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3`}>
                {emoji}
              </div>
              <p className="font-bold text-dark text-sm">{cat}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">{desc}</p>
              <p className="text-brand-500 text-xs font-semibold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight size={11} />
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Category Showcase Sections (only when not filtering) ── */}
      {!isFiltering && !loading && Object.entries(byCategory).map(([cat, catProducts]) => (
        <section key={cat} className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_META[cat]?.emoji || "🧩"}</span>
              <h2 className="text-xl font-bold text-dark">{cat}</h2>
              <span className="text-sm text-gray-400 font-normal">({catProducts.length})</span>
            </div>
            <button onClick={() => { setCategory(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:underline">
              See all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {catProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      ))}

      {/* ── All Products / Filtered Grid ─────────────── */}
      <section id="products" className="max-w-7xl mx-auto px-4 pb-14">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-4 border-t border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-dark">
              {searchQuery ? `Results for "${searchQuery}"` : category === "All" ? "All Products" : category}
            </h2>
            {!loading && <p className="text-sm text-gray-400 mt-0.5">{filtered.length} products</p>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${category === c ? "bg-brand-500 text-white border-brand-500" : "bg-white text-gray-600 border-gray-200 hover:border-brand-500 hover:text-brand-500"}`}>
                  {c}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
              <SlidersHorizontal size={13} className="text-gray-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="text-xs text-gray-600 focus:outline-none bg-transparent">
                <option value="default">Sort: Default</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">No products found.</p>
            <button onClick={() => setCategory("All")} className="mt-4 text-brand-500 text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
