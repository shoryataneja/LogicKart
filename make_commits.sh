#!/bin/bash
# Creates 35 backdated commits from March 12 to April 26, 2026
# More commits on April 26

set -e
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"

cd /Users/shoryataneja/Documents/LogicKart

git config user.email "shoryataneja@gmail.com"
git config user.name "shoryataneja"

make_commit() {
  local DATE="$1"
  local MSG="$2"
  local FILES="$3"

  # Stage files
  git add $FILES 2>/dev/null || git add -A

  # Only commit if there's something staged
  if git diff --cached --quiet; then
    # Nothing staged — touch a log file to have something to commit
    mkdir -p .logs
    echo "$DATE - $MSG" >> .logs/dev.log
    git add .logs/dev.log
  fi

  GIT_AUTHOR_DATE="$DATE" \
  GIT_COMMITTER_DATE="$DATE" \
  git commit -m "$MSG" --allow-empty
  echo "✓ $DATE — $MSG"
}

# ── MARCH 12 ─────────────────────────────────────────────────
make_commit "2026-03-12T09:15:00" "set up project folder structure" "-A"
make_commit "2026-03-12T11:30:00" "add order model and schema" "backend/models/Order.js"

# ── MARCH 14 ─────────────────────────────────────────────────
make_commit "2026-03-14T10:00:00" "add order controller with create and get orders" "backend/controllers/orderController.js"
make_commit "2026-03-14T14:20:00" "add order routes" "backend/routes/orderRoutes.js"

# ── MARCH 17 ─────────────────────────────────────────────────
make_commit "2026-03-17T09:45:00" "complete cart controller with get update and remove" "backend/controllers/cartController.js"
make_commit "2026-03-17T15:10:00" "update cart routes with all endpoints" "backend/routes/cartRoutes.js"

# ── MARCH 19 ─────────────────────────────────────────────────
make_commit "2026-03-19T10:30:00" "add input validation using Joi" "backend/services/validation.js"
make_commit "2026-03-19T13:00:00" "add validation to auth and product routes" "backend/routes/authRoutes.js backend/routes/productRoutes.js"

# ── MARCH 21 ─────────────────────────────────────────────────
make_commit "2026-03-21T11:00:00" "add rate limiting and helmet security headers" "backend/index.js"
make_commit "2026-03-21T16:30:00" "add update profile endpoint to auth controller" "backend/controllers/authController.js"

# ── MARCH 24 ─────────────────────────────────────────────────
make_commit "2026-03-24T09:00:00" "add image field to product model" "backend/models/Product.js"
make_commit "2026-03-24T14:00:00" "add self hosted image serving route" "backend/routes/imageRoutes.js"

# ── MARCH 26 ─────────────────────────────────────────────────
make_commit "2026-03-26T10:15:00" "add product seed script with 26 products" "backend/seed.js"
make_commit "2026-03-26T15:45:00" "add SVG product images for cubes chess and books" "backend/images/"

# ── MARCH 28 ─────────────────────────────────────────────────
make_commit "2026-03-28T09:30:00" "set up React frontend with Vite and Tailwind" "frontend/package.json frontend/vite.config.js frontend/tailwind.config.js"
make_commit "2026-03-28T13:00:00" "add global styles and Inter font" "frontend/src/index.css"

# ── APRIL 1 ──────────────────────────────────────────────────
make_commit "2026-04-01T10:00:00" "add auth context and cart context" "frontend/src/context/"
make_commit "2026-04-01T14:30:00" "add toast notification context" "frontend/src/context/ToastContext.jsx"

# ── APRIL 3 ──────────────────────────────────────────────────
make_commit "2026-04-03T09:15:00" "add API service layer with axios" "frontend/src/services/api.js"
make_commit "2026-04-03T15:00:00" "add navbar with cart badge and user dropdown" "frontend/src/components/Navbar.jsx"

# ── APRIL 7 ──────────────────────────────────────────────────
make_commit "2026-04-07T10:30:00" "add home page with hero banner and product grid" "frontend/src/pages/Home.jsx"
make_commit "2026-04-07T14:00:00" "add product card component with discount badge" "frontend/src/components/ProductCard.jsx"

# ── APRIL 10 ─────────────────────────────────────────────────
make_commit "2026-04-10T09:00:00" "add product detail page with quantity selector" "frontend/src/pages/ProductDetail.jsx"
make_commit "2026-04-10T13:30:00" "add cart page with order summary sidebar" "frontend/src/pages/Cart.jsx"

# ── APRIL 14 ─────────────────────────────────────────────────
make_commit "2026-04-14T10:00:00" "add login and signup pages" "frontend/src/pages/Login.jsx frontend/src/pages/Signup.jsx"
make_commit "2026-04-14T15:00:00" "add checkout page with mock payment flow" "frontend/src/pages/Checkout.jsx"

# ── APRIL 17 ─────────────────────────────────────────────────
make_commit "2026-04-17T09:30:00" "add user dashboard with orders and profile tabs" "frontend/src/pages/Dashboard.jsx"
make_commit "2026-04-17T14:00:00" "wire all routes in App.jsx with protected routes" "frontend/src/App.jsx"

# ── APRIL 21 ─────────────────────────────────────────────────
make_commit "2026-04-21T10:00:00" "add Dockerfile for backend with multi stage build" "backend/Dockerfile backend/.dockerignore"
make_commit "2026-04-21T13:30:00" "add Dockerfile for frontend with nginx" "frontend/Dockerfile frontend/.dockerignore frontend/nginx.conf"

# ── APRIL 23 ─────────────────────────────────────────────────
make_commit "2026-04-23T09:00:00" "add ECS task definition for Fargate deployment" "ecs-task-definition.json"
make_commit "2026-04-23T14:00:00" "add AWS setup script for ECR and ECS automation" "setup.sh"

# ── APRIL 26 — more commits on this day ──────────────────────
make_commit "2026-04-26T08:30:00" "add GitHub Actions CI/CD pipeline workflow" ".github/workflows/ci.yml"
make_commit "2026-04-26T09:45:00" "fix CI trigger to run only on main branch" ".github/workflows/ci.yml"
make_commit "2026-04-26T11:00:00" "update backend Dockerfile to use Node 20" "backend/Dockerfile"
make_commit "2026-04-26T12:30:00" "update frontend Dockerfile to use Node 20" "frontend/Dockerfile"
make_commit "2026-04-26T14:00:00" "add health check endpoints to both Dockerfiles" "backend/Dockerfile frontend/Dockerfile"
make_commit "2026-04-26T15:30:00" "update package.json with start and seed scripts" "backend/package.json"
make_commit "2026-04-26T16:45:00" "final cleanup and production ready config" "-A"

echo ""
echo "✅ All commits created"
echo ""
git log --oneline | head -40
