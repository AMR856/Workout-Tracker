import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { errorHandler } from './utils/errorHandler';
import userRouter  from './modules/users/user.route';

const port = process.env.PORT || 5000;
const app = express();

app.use(errorHandler);
app.use(bodyParser.json());
app.use("/users", userRouter);

// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`),
);
