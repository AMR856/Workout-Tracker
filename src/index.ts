import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import client from "prom-client";
import { errorHandler } from './utils/errorHandler';
import { seedExercises } from "./seeders/exercise.seeder";
import userRouter  from './modules/users/user.route';
import workoutRouter from './modules/workouts/workout.route';
import { setupSwagger } from "./config/swagger";
import { countRequests } from "./middlewares/countRequests";

const port = process.env.PORT || 5000;
const app = express();
// 957d5d82-999f-47fa-a9ee-5023bcc4b1b3
app.use(errorHandler);
app.use(countRequests);
app.use(bodyParser.json());
app.use("/auth", userRouter);
app.use('/workouts', workoutRouter);
// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts
setupSwagger(app);
async function bootstrap() {
  await seedExercises();
  initPrometheus(app);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

const initPrometheus = (app: any) => {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get("/metrics", async (req: any, res: any) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
};

bootstrap();