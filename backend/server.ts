import express, { Express } from "express";

import { linksRoutes } from "./routes/links.ts";
import { createUserRoutes } from "./routes/create-user.ts";

import publicRoutes from "./constants/publicRoutes.ts";
import validBearerToken from "./validBearerToken.ts";
import { db } from "./database/db.ts";

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

app.listen(Bun.env.PORT, () => {
  console.log("port: ", Bun.env.PORT);
});
