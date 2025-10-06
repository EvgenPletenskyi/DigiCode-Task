# Build & Deployment Manual

## Prerequisites
- Node.js 20.x (LTS) with npm
- macOS or Linux shell (Windows works via WSL)
- Optional: Pixi.js Devtools for runtime inspection

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   - Vite will serve on `http://localhost:5173` by default.
   - Hot module replacement is enabled; reloads happen automatically.

## Production Build
1. Generate the optimized bundle:
   ```bash
   npm run build
   ```
   - Output is written to `dist/`.
   - Review build warnings/errors before proceeding.
2. Preview the production build locally (optional but recommended):
   ```bash
   npm run preview
   ```