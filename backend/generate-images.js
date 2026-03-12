/**
 * Generates all remaining product SVG images
 * Run: node generate-images.js
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "images");

const bookSVG = ({ slug, title, subtitle, author, color1, color2, accent, textColor = "#fff" }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <ellipse cx="200" cy="372" rx="110" ry="11" fill="#e0e0e0"/>
  <!-- Book shadow -->
  <rect x="82" y="42" width="240" height="316" rx="4" fill="#00000022"/>
  <!-- Book back -->
  <rect x="78" y="38" width="240" height="316" rx="4" fill="${color2}"/>
  <!-- Spine -->
  <rect x="78" y="38" width="22" height="316" rx="4" fill="${color1}" opacity="0.7"/>
  <!-- Cover -->
  <rect x="88" y="38" width="230" height="316" rx="4" fill="${color1}"/>
  <!-- Top accent bar -->
  <rect x="88" y="38" width="230" height="8" rx="2" fill="${accent}"/>
  <!-- Bottom accent bar -->
  <rect x="88" y="346" width="230" height="8" rx="2" fill="${accent}"/>
  <!-- Decorative pattern -->
  <circle cx="200" cy="160" r="55" fill="${accent}" opacity="0.15"/>
  <circle cx="200" cy="160" r="38" fill="${accent}" opacity="0.15"/>
  <circle cx="200" cy="160" r="22" fill="${accent}" opacity="0.2"/>
  <!-- Title -->
  <text x="203" y="120" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="${textColor}" font-weight="bold" opacity="0.95">${title}</text>
  ${subtitle ? `<text x="203" y="142" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="${textColor}" opacity="0.8">${subtitle}</text>` : ""}
  <!-- Author -->
  <text x="203" y="310" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="${textColor}" opacity="0.85">${author}</text>
  <!-- Publisher line -->
  <rect x="130" y="320" width="146" height="1" fill="${textColor}" opacity="0.3"/>
</svg>`.trim();

const boardGameSVG = ({ slug, title, color, icon, desc }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <ellipse cx="200" cy="372" rx="120" ry="11" fill="#e0e0e0"/>
  <!-- Box -->
  <rect x="55" y="55" width="290" height="290" rx="10" fill="${color}"/>
  <!-- Box lid highlight -->
  <rect x="55" y="55" width="290" height="50" rx="10" fill="#ffffff22"/>
  <!-- Icon area -->
  <text x="200" y="210" text-anchor="middle" font-size="80" font-family="Arial">${icon}</text>
  <!-- Title -->
  <text x="200" y="80" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#ffffff" font-weight="bold">${title}</text>
  <!-- Desc -->
  <text x="200" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#ffffff" opacity="0.85">${desc}</text>
  <!-- Bottom strip -->
  <rect x="55" y="310" width="290" height="35" rx="5" fill="#00000033"/>
  <text x="200" y="333" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#ffffff" opacity="0.9">Board Game</text>
</svg>`.trim();

const images = [
  // Board games
  {
    file: "catan.svg",
    svg: boardGameSVG({ slug: "catan", title: "CATAN", color: "#e65100", icon: "🏝️", desc: "Build · Trade · Settle" }),
  },
  {
    file: "scrabble.svg",
    svg: boardGameSVG({ slug: "scrabble", title: "SCRABBLE", color: "#1565c0", icon: "🔤", desc: "Classic Word Game" }),
  },
  {
    file: "ludo.svg",
    svg: boardGameSVG({ slug: "ludo", title: "LUDO", color: "#6a1b9a", icon: "🎲", desc: "Classic Family Game" }),
  },
  {
    file: "snakes-ladders.svg",
    svg: boardGameSVG({ slug: "snakes-ladders", title: "SNAKES & LADDERS", color: "#2e7d32", icon: "🐍", desc: "Classic Board Game" }),
  },
  // Books
  {
    file: "book-calculus.svg",
    svg: bookSVG({ slug: "book-calculus", title: "Calculus", subtitle: "Early Transcendentals", author: "James Stewart", color1: "#1565c0", color2: "#0d47a1", accent: "#ffd600" }),
  },
  {
    file: "book-clrs.svg",
    svg: bookSVG({ slug: "book-clrs", title: "Introduction to", subtitle: "Algorithms", author: "Cormen · Leiserson · Rivest · Stein", color1: "#212121", color2: "#111111", accent: "#e53935" }),
  },
  {
    file: "book-how-to-solve.svg",
    svg: bookSVG({ slug: "book-how-to-solve", title: "How to Solve It", subtitle: "A New Aspect of Mathematical Method", author: "G. Pólya", color1: "#4a148c", color2: "#38006b", accent: "#ce93d8" }),
  },
  {
    file: "book-thinking.svg",
    svg: bookSVG({ slug: "book-thinking", title: "Thinking,", subtitle: "Fast and Slow", author: "Daniel Kahneman", color1: "#bf360c", color2: "#870000", accent: "#ffcc02" }),
  },
  {
    file: "book-engineering-math.svg",
    svg: bookSVG({ slug: "book-engineering-math", title: "Engineering", subtitle: "Mathematics", author: "H.K. Dass", color1: "#1b5e20", color2: "#003300", accent: "#a5d6a7" }),
  },
  {
    file: "book-logical-reasoning.svg",
    svg: bookSVG({ slug: "book-logical-reasoning", title: "Logical Reasoning", subtitle: "Practice Book", author: "Arihant Experts", color1: "#e65100", color2: "#bf360c", accent: "#fff9c4" }),
  },
  {
    file: "book-puzzles.svg",
    svg: bookSVG({ slug: "book-puzzles", title: "Puzzle & Brain", subtitle: "Teasers", author: "Dover Publications", color1: "#006064", color2: "#00363a", accent: "#80deea" }),
  },
  {
    file: "book-linear-algebra.svg",
    svg: bookSVG({ slug: "book-linear-algebra", title: "Linear Algebra", subtitle: "Done Right", author: "Sheldon Axler", color1: "#37474f", color2: "#102027", accent: "#b0bec5" }),
  },
  {
    file: "book-ctci.svg",
    svg: bookSVG({ slug: "book-ctci", title: "Cracking the", subtitle: "Coding Interview", author: "Gayle Laakmann McDowell", color1: "#1a237e", color2: "#000051", accent: "#7986cb" }),
  },
  {
    file: "book-discrete-math.svg",
    svg: bookSVG({ slug: "book-discrete-math", title: "Discrete Mathematics", subtitle: "and Its Applications", author: "Kenneth H. Rosen", color1: "#880e4f", color2: "#560027", accent: "#f48fb1" }),
  },
  {
    file: "book-aops.svg",
    svg: bookSVG({ slug: "book-aops", title: "The Art of", subtitle: "Problem Solving Vol. 1", author: "Sandor Lehoczky · Richard Rusczyk", color1: "#e65100", color2: "#ac1900", accent: "#ffe082" }),
  },
];

images.forEach(({ file, svg }) => {
  const filePath = path.join(dir, file);
  fs.writeFileSync(filePath, svg, "utf8");
  console.log(`✅ Created ${file}`);
});

console.log(`\n🎨 Generated ${images.length} SVG images`);
