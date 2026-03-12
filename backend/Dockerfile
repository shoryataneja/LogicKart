# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install ALL deps (including dev) for the build stage
RUN npm ci --only=production

# ── Stage 2: Production image ───────────────────────────────────
FROM node:20-alpine AS production

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# Remove dev files not needed in production
RUN rm -f .env seed.js generate-images.js

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Expose the port the app runs on
EXPOSE 3002

# Health check — ECS uses this to determine container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3002/ || exit 1

CMD ["node", "index.js"]
