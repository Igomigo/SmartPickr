# Playwright's official image ships Chromium + all the OS libraries it needs,
# so headless scraping works out of the box (the #1 cause of "works locally,
# crashes on deploy" is missing system deps — this avoids it).
# Pin to the same Playwright version as package.json (1.57.0).
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# Use Yarn 4 (Corepack ships with Node and reads packageManager from package.json)
RUN corepack enable

# Install deps first (better layer caching — only re-runs when manifests change)
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# Build the TypeScript -> dist
COPY . .
RUN yarn build

# Railway sets PORT at runtime; the app reads it via env-preflight.
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
