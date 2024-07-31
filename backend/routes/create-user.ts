import { Router } from "express";
import * as bcrypt from "bcryptjs";

import { ErrorCodes } from "../constants/errors";
import Error from "../types/error.type";
import { db } from "../database/db";

const router = Router();

// post

router.post("/", async (req, res) => {
  const submittedFields = req.body;
  let resError: Error | undefined;
  if (!submittedFields.username || !submittedFields.password) {
    res.json({
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    });
    return;
  }
  await bcrypt.hash(submittedFields.password, 15, (error, result) => {
    if (error) {
      resError = {
        errorCode: ErrorCodes.UnexpectedErrorRaisedWhileHashingPassword,
        errorMessage: "Unexpected error was raised while creating user.",
      };
      return;
    }
  });
});

export { router as createUserRoutes };
