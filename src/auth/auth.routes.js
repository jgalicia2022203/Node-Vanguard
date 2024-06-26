import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { auth } from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  [
    check("username", "The username is required").not().isEmpty(),
    check("password", "The password is required").not().isEmpty(),
    validateFields,
  ],
  auth
);

export default router;
