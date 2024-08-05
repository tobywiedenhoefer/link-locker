import express, { Express } from "express";

import { linksRoutes } from "./routes/links.ts";

import publicRoutes from "./constants/publicRoutes.ts";
import { createUserRoutes } from "./routes/create-user.ts";
import { userRoutes } from "./routes/user.ts";
import { lockersRoutes } from "./routes/lockers.ts";
import { tokenRoutes } from "./routes/token.ts";

import validBearerToken from "./validBearerToken.ts";

const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "localhost");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (!publicRoutes.includes(req.path)) {
    validBearerToken(req.headers.authorization);
  }
  next();
});

app.use("/api/links", linksRoutes);
app.use("/api/create-user", createUserRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/lockers/", lockersRoutes);
app.use("/api/token/", tokenRoutes);

app.listen(Bun.env.PORT, () => {
  console.log("port: ", Bun.env.PORT);
});
