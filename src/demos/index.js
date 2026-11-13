// Each demo is loaded on demand with a dynamic import().
// Vite turns every import() below into its own small JS file (a "chunk").
export const DEMO_LOADERS = {
  security: () => import('./SecurityDemo.jsx'),
  software: () => import('./SoftwareDemo.jsx'),
  data: () => import('./DataDemo.jsx'),
  cloud: () => import('./CloudDemo.jsx'),
  supply: () => import('./SupplyDemo.jsx'),
  risk: () => import('./RiskDemo.jsx'),
}

// Start downloading a demo early (the browser caches it, so it's instant later)
export const preloadDemo = (id) => DEMO_LOADERS[id]?.()
