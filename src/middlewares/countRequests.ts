import { Request, Response, NextFunction } from "express";
import client from "prom-client";

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

export const countRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.url,
      status: res.statusCode,
    });
  });
  next();
};
