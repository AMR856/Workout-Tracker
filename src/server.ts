import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { seedExercises } from "./seeders/exercise.seeder";

const port = process.env.PORT || 5000;

async function bootstrap() {
  await seedExercises();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();
