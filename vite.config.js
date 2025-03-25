import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define allowed origins
const allowedOrigins = [
  "https://saitachain.com",
  "https://saitachain.com:444",
  "https://saitachain.com:3000",
  "https://rezor.org",
  "https://www.rezor.org",
  "https://admin.rezor.org/",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:444",
  "http://localhost:444/src/admin",
];

// Custom middleware to handle CORS
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
}

export default defineConfig({
  plugins: [react()],
  base: "/src/admin",
  server: {
    host: "0.0.0.0",
    hmr: {
      overlay: "false",
    },

    headers: {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Content-Security-Policy": "upgrade-insecure-requests",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    setupMiddlewares: (middlewares, { app }) => {
      app.use(corsMiddleware); // Use the custom CORS middleware
      return middlewares; // Return the middlewares array
    },
  },
});
