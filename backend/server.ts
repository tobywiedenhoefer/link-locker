import express, { Express } from "express";

import { linksRoutes } from "./routes/links.ts";

import publicRoutes from "./constants/publicRoutes.ts";
import { createUserRoutes } from "./routes/create-user.ts";
import { userRoutes } from "./routes/user.ts";
import { lockersRoutes } from "./routes/lockers.ts";
import { tokenRoutes } from "./routes/token.ts";
import { usernameAvailableRoute } from "./routes/username-available.ts";

import verifyBearerToken from "./verifyBearerToken.ts";

const app: Express = express();

app.use(express.json());

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (!publicRoutes.includes(req.path)) {
    const bearerTokenVerified = await verifyBearerToken(
      req.headers.authorization
    );
    if (!bearerTokenVerified.success) {
      res.json(bearerTokenVerified);
      return;
    }
    req.body.userId = bearerTokenVerified.payload;
  }
  next();
});

app.use("/api/links", linksRoutes);
app.use("/api/create-user", createUserRoutes);
app.use("/api/username-available", usernameAvailableRoute);
app.use("/api/user/", userRoutes);
app.use("/api/lockers/", lockersRoutes);
app.use("/api/token/", tokenRoutes);

app.listen(Bun.env.PORT, () => {
  console.log("port: ", Bun.env.PORT);
});
