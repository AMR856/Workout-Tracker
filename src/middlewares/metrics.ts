import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestTotal } from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer();
  
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: req.route?.path ?? req.path,
      status: res.statusCode.toString(),
    };
    end(labels);
    httpRequestTotal.inc(labels);
  });

  next();
}
