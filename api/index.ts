import { app } from "../server/app";
import { registerRoutes } from "../server/routes";
import { type Request, type Response, type NextFunction } from "express";

let routesRegistered = false;
let setupPromise: Promise<void> | null = null;

async function setup() {
  if (routesRegistered) return;
  await registerRoutes(app);
  // Error handling middleware — must be after routes
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("[API Error]", err);
    res.status(status).json({ message });
  });
  routesRegistered = true;
}

// Pre-warm on cold start
setupPromise = setup();

// Vercel calls this as the default export handler
export default async function handler(req: Request, res: Response) {
  // Ensure routes are set up before handling any request
  await setupPromise;
  return app(req, res);
}
