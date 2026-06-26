import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { errorHandler } from './utils/errorHandler';
import userRouter from './modules/users/user.route';
import workoutRouter from './modules/workouts/workout.route';
import exerciseRouter from './modules/exercises/exercise.route';
import { setupSwagger } from "./config/swagger";
import { countRequests } from "./middlewares/countRequests";
import { metricsMiddleware } from "./middlewares/metrics";
import { register } from "./metrics";

const app = express();
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});
app.use(countRequests);
app.use(metricsMiddleware);
app.use(bodyParser.json());
app.use("/auth", userRouter);
app.use('/workouts', workoutRouter);
app.use('/exercises', exerciseRouter);
app.use(errorHandler);

setupSwagger(app);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default app;
