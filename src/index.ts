import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { errorHandler } from './utils/errorHandler';
import { seedExercises } from "./seeders/exercise.seeder";
import userRouter  from './modules/users/user.route';
import workoutRouter from './modules/workouts/workout.route';
import { setupSwagger } from "./config/swagger";

const port = process.env.PORT || 5000;
const app = express();

app.use(errorHandler);
app.use(bodyParser.json());
app.use("/auth", userRouter);
app.use('/workouts', workoutRouter);
// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts
setupSwagger(app);
async function bootstrap() {
  await seedExercises();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();