
# ── Stage 1: Production Runtime Image ──────────────────────────────────
FROM node:20-slim AS runner

# Install curl for healthcheck validation
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Set production environment flags
ENV NODE_ENV=production \
    DOCKER_ENV=true \
    PORT=3000

# Copy package dependency manifests first for layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code with non-root node user ownership
COPY --chown=node:node . .

# Ensure exports directory exists with correct write permissions
RUN mkdir -p /usr/src/app/exports && chown -R node:node /usr/src/app/exports

# Run as unprivileged user for container security
USER node

# Expose API port
EXPOSE 3000

# Container healthcheck against /health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start server
CMD ["node", "server.js"]
