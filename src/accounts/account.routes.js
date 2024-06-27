import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  closeAccount,
  deactivateAccount,
  getAccountById,
  listAccountsByTransactions,
} from "./account.controller.js";

const router = Router();

router.get("/:id", [validateJWT, validateFields], getAccountById);

router.get("/", [validateJWT, validateFields], listAccountsByTransactions);

router.patch(
  "/deactivate/:id",
  [validateJWT, validateFields],
  deactivateAccount
);

router.patch("/close/:id", [validateJWT, validateFields], closeAccount);

export default router;
