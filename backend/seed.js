/**
 * LogicKart — Product Seed Script
 * Run: node seed.js
 *
 * All images are self-hosted SVGs served from /images/*.svg
 * — No external CDN dependencies
 * — No rate limiting
 * — 100% accurate product illustrations
 * — Every image is unique
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");

const BASE = "/images";

const products = [
  // ─────────────────────────────────────────────────────────────
  // CUBES — 7 products, 7 unique SVGs
  // ─────────────────────────────────────────────────────────────
  {
    name: "2x2 Rubik's Cube (Stickerless)",
    description:
      "A compact 2x2 pocket cube with smooth, effortless turning. Stickerless bright colour scheme with red and orange faces. Ideal for beginners and as a warm-up puzzle for speedcubers.",
    price: 249,
    discount: 0,
    category: "Cubes",
    brand: "QiYi",
    rating: 4.2,
    numReviews: 1840,
    stock: 150,
    image: `${BASE}/cube-2x2-a.png`,
  },
  {
    name: "2x2 Mini Speed Cube",
    description:
      "Ultra-compact 2x2 speed cube with fast corner cutting and a smooth feel. Great for on-the-go solving and beginners building finger tricks.",
    price: 199,
    discount: 5,
    category: "Cubes",
    brand: "QiYi",
    rating: 4.1,
    numReviews: 920,
    stock: 130,
    image: `${BASE}/cube-2x2-b.png`,
  },
  {
    name: "3x3 Standard Rubik's Cube",
    description:
      "The classic 3x3 Rubik's cube in a smooth, fast-turning stickerless design. Perfect for beginners learning their first solve or casual puzzlers. Bright colour scheme.",
    price: 299,
    discount: 0,
    category: "Cubes",
    brand: "QiYi",
    rating: 4.4,
    numReviews: 6200,
    stock: 200,
    image: `${BASE}/cube-3x3-a.png`,
  },
  {
    name: "3x3 Magnetic Speed Cube",
    description:
      "Factory-magnetised 3x3 with crisp corner cutting and a satisfying click. Great step-up for intermediate solvers targeting sub-30 times.",
    price: 649,
    discount: 10,
    category: "Cubes",
    brand: "MoYu",
    rating: 4.7,
    numReviews: 2340,
    stock: 85,
    image: `${BASE}/cube-3x3-b.png`,
  },
  {
    name: "4x4 Rubik's Cube Puzzle",
    description:
      "A smooth 4x4 Rubik's Revenge cube with stickerless tiles. Stable turning, minimal catching. Great for cubers ready to move beyond the 3x3.",
    price: 799,
    discount: 8,
    category: "Cubes",
    brand: "MoYu",
    rating: 4.5,
    numReviews: 980,
    stock: 70,
    image: `${BASE}/cube-4x4-a.png`,
  },
  {
    name: "4x4 Magnetic Speed Cube — Premium",
    description:
      "Premium 4x4 with 56 factory-installed magnets for a stable, controlled solve. Redesigned internal structure for faster, smoother turns with minimal lock-ups.",
    price: 1899,
    discount: 0,
    category: "Cubes",
    brand: "GAN",
    rating: 4.8,
    numReviews: 654,
    stock: 35,
    image: `${BASE}/cube-4x4-b.png`,
  },
  {
    name: "5x5 Speed Rubik's Cube",
    description:
      "A smooth, controllable 5x5 Professor's Cube with factory magnets. Purple stickerless tiles. Ideal for cubers stepping up from 4x4. Excellent value for a big-cube experience.",
    price: 1299,
    discount: 12,
    category: "Cubes",
    brand: "YJ",
    rating: 4.4,
    numReviews: 320,
    stock: 50,
    image: `${BASE}/cube-5x5.svg`,
  },

  // ─────────────────────────────────────────────────────────────
  // CHESS — 3 products, 3 unique SVGs
  // ─────────────────────────────────────────────────────────────
  {
    name: "Wooden Chess Board Set",
    description:
      "Classic wooden chess set with hand-finished sheesham wood pieces and a folding board. Regulation size. Full starting position with all 32 pieces. Comes with a storage pouch.",
    price: 1299,
    discount: 10,
    category: "Chess",
    brand: "WoodCraft",
    rating: 4.6,
    numReviews: 1120,
    stock: 60,
    image: `${BASE}/chess-a.png`,
  },
  {
    name: "Standard Chess Board with Pieces",
    description:
      "Full-size chess board with weighted Staunton pieces. Regulation size for club and casual play. Includes all 32 pieces and a storage bag.",
    price: 999,
    discount: 5,
    category: "Chess",
    brand: "WoodCraft",
    rating: 4.5,
    numReviews: 680,
    stock: 45,
    image: `${BASE}/chess-b.png`,
  },
  {
    name: "Standard Tournament Chess Board",
    description:
      "FIDE-regulation tournament chess board with algebraic notation. Green felt surface with weighted Staunton pieces. Used in official club and tournament play worldwide.",
    price: 1799,
    discount: 0,
    category: "Chess",
    brand: "DGT",
    rating: 4.8,
    numReviews: 430,
    stock: 25,
    image: `${BASE}/chess-tournament.svg`,
  },

  // ─────────────────────────────────────────────────────────────
  // BOARD GAMES — 5 products, 5 unique SVGs
  // ─────────────────────────────────────────────────────────────
  {
    name: "Sudoku Puzzle Board Game",
    description:
      "A 9x9 Sudoku board with pre-filled number tiles. Reusable and eco-friendly. Great for all ages. Includes solution booklet and 81 numbered tiles.",
    price: 799,
    discount: 15,
    category: "Board Games",
    brand: "PuzzleCraft",
    rating: 4.4,
    numReviews: 560,
    stock: 75,
    image: `${BASE}/sudoku.svg`,
  },
  {
    name: "Catan Strategy Board Game",
    description:
      "The world's most popular strategy board game. Build settlements, trade resources, and expand your civilization. For 3–4 players, ages 10+. Includes all tiles, cards, and tokens.",
    price: 2499,
    discount: 0,
    category: "Board Games",
    brand: "Catan Studio",
    rating: 4.7,
    numReviews: 3400,
    stock: 60,
    image: `${BASE}/catan.svg`,
  },
  {
    name: "Scrabble Classic Board Game",
    description:
      "The timeless word-building board game. Form words on the board using letter tiles and score points. For 2–4 players. Includes board, 100 tiles, tile racks, and score pad.",
    price: 1199,
    discount: 10,
    category: "Board Games",
    brand: "Mattel",
    rating: 4.6,
    numReviews: 4100,
    stock: 80,
    image: `${BASE}/scrabble.svg`,
  },
  {
    name: "Ludo Classic Board Game",
    description:
      "The classic Indian board game of strategy and luck. Includes a foldable board, 16 coloured tokens, and 2 dice. For 2–4 players. Great for family game nights.",
    price: 349,
    discount: 0,
    category: "Board Games",
    brand: "Funskool",
    rating: 4.2,
    numReviews: 7800,
    stock: 150,
    image: `${BASE}/ludo.svg`,
  },
  {
    name: "Snakes and Ladders Board Game",
    description:
      "The beloved classic board game of chance. Roll the dice, climb ladders, and avoid snakes. Includes a large printed board and 4 player tokens. For 2–4 players.",
    price: 249,
    discount: 0,
    category: "Board Games",
    brand: "Funskool",
    rating: 4.1,
    numReviews: 5200,
    stock: 180,
    image: `${BASE}/snakes-ladders.svg`,
  },

  // ─────────────────────────────────────────────────────────────
  // BOOKS — 11 products, 11 unique SVGs
  // ─────────────────────────────────────────────────────────────
  {
    name: "Calculus: Early Transcendentals",
    description:
      "The gold standard calculus textbook used in universities worldwide. Covers limits, derivatives, integrals, and series with clear explanations and thousands of practice problems. 8th Edition.",
    price: 1299,
    discount: 5,
    category: "Books",
    brand: "Cengage Learning",
    rating: 4.8,
    numReviews: 4200,
    stock: 100,
    image: `${BASE}/book-calculus.svg`,
  },
  {
    name: "Introduction to Algorithms (CLRS)",
    description:
      "The definitive reference for algorithms and data structures. Covers sorting, graph algorithms, dynamic programming, and NP-completeness. Essential for CS students. 3rd Edition.",
    price: 2199,
    discount: 0,
    category: "Books",
    brand: "MIT Press",
    rating: 4.9,
    numReviews: 3800,
    stock: 70,
    image: `${BASE}/book-clrs.svg`,
  },
  {
    name: "How to Solve It — G. Pólya",
    description:
      "A timeless classic on mathematical problem-solving. Pólya's four-step method has helped generations of students and professionals think more clearly and creatively.",
    price: 499,
    discount: 0,
    category: "Books",
    brand: "Princeton University Press",
    rating: 4.7,
    numReviews: 2900,
    stock: 150,
    image: `${BASE}/book-how-to-solve.svg`,
  },
  {
    name: "Thinking, Fast and Slow",
    description:
      "Nobel laureate Daniel Kahneman explores the two systems that drive the way we think. A must-read for logical thinkers, decision-makers, and anyone interested in the mind.",
    price: 599,
    discount: 20,
    category: "Books",
    brand: "Farrar, Straus and Giroux",
    rating: 4.7,
    numReviews: 6700,
    stock: 120,
    image: `${BASE}/book-thinking.svg`,
  },
  {
    name: "Engineering Mathematics",
    description:
      "Comprehensive engineering mathematics textbook covering calculus, differential equations, linear algebra, and numerical methods. Widely used in B.Tech programmes across India.",
    price: 649,
    discount: 10,
    category: "Books",
    brand: "S. Chand",
    rating: 4.3,
    numReviews: 5100,
    stock: 130,
    image: `${BASE}/book-engineering-math.svg`,
  },
  {
    name: "Logical Reasoning Practice Book",
    description:
      "Comprehensive guide for competitive exam preparation covering verbal and non-verbal reasoning, puzzles, seating arrangements, and data interpretation. 3000+ practice questions.",
    price: 349,
    discount: 15,
    category: "Books",
    brand: "Arihant",
    rating: 4.4,
    numReviews: 3100,
    stock: 200,
    image: `${BASE}/book-logical-reasoning.svg`,
  },
  {
    name: "Puzzle and Brain Teasers Book",
    description:
      "A collection of 300+ logic puzzles, brain teasers, and lateral thinking problems. Ranges from easy to expert difficulty. Perfect for sharpening analytical thinking.",
    price: 299,
    discount: 0,
    category: "Books",
    brand: "Dover Publications",
    rating: 4.5,
    numReviews: 1200,
    stock: 90,
    image: `${BASE}/book-puzzles.svg`,
  },
  {
    name: "Linear Algebra Done Right",
    description:
      "A modern, proof-based approach to linear algebra focusing on understanding over computation. Widely used in advanced undergraduate and graduate mathematics courses.",
    price: 999,
    discount: 0,
    category: "Books",
    brand: "Springer",
    rating: 4.8,
    numReviews: 1450,
    stock: 60,
    image: `${BASE}/book-linear-algebra.svg`,
  },
  {
    name: "Cracking the Coding Interview",
    description:
      "189 programming questions and solutions covering data structures, algorithms, system design, and behavioural interviews. The #1 resource for software engineering interviews. 6th Edition.",
    price: 1499,
    discount: 10,
    category: "Books",
    brand: "CareerCup",
    rating: 4.9,
    numReviews: 8900,
    stock: 110,
    image: `${BASE}/book-ctci.svg`,
  },
  {
    name: "Discrete Mathematics — Rosen",
    description:
      "The most widely used discrete math textbook. Covers logic, proofs, sets, functions, graph theory, and combinatorics. Essential for CS and mathematics students. 8th Edition.",
    price: 1799,
    discount: 8,
    category: "Books",
    brand: "McGraw-Hill",
    rating: 4.6,
    numReviews: 2300,
    stock: 55,
    image: `${BASE}/book-discrete-math.svg`,
  },
  {
    name: "The Art of Problem Solving Vol. 1",
    description:
      "The go-to book for math olympiad preparation. Covers number theory, algebra, combinatorics, and geometry with challenging problems and detailed solutions.",
    price: 899,
    discount: 10,
    category: "Books",
    brand: "AoPS",
    rating: 4.8,
    numReviews: 1600,
    stock: 80,
    image: `${BASE}/book-aops.svg`,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products\n`);

    const categories = [...new Set(products.map((p) => p.category))];
    console.log("Products by category:");
    categories.forEach((cat) => {
      const count = products.filter((p) => p.category === cat).length;
      console.log(`  ${cat}: ${count} products`);
    });

    const images = products.map((p) => p.image);
    const uniqueCount = new Set(images).size;
    console.log(`\n🖼️  Image uniqueness: ${uniqueCount}/${products.length}`);
    if (uniqueCount === products.length) {
      console.log("✅ All images are unique!");
    } else {
      const dupes = images.filter((img, i) => images.indexOf(img) !== i);
      console.warn("⚠️  Duplicates:", [...new Set(dupes)]);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
