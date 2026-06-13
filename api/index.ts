import { app } from "../server/app";
import { registerRoutes } from "../server/routes";
import { type Request, type Response, type NextFunction } from "express";

// Register routes synchronously
registerRoutes(app);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
