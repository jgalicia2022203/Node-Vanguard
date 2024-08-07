import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  closeAccount,
  deactivateAccount,
  getAccountByAccountNo,
  getAccountById,
  listAccountsByTransactions,
  searchAccounts,
} from "./account.controller.js";

const router = Router();

router.get("/search", [validateJWT, validateFields], searchAccounts);

router.get("/:id", [validateJWT, validateFields], getAccountById);

router.get("/", [validateJWT, validateFields], listAccountsByTransactions);

router.patch(
  "/deactivate/:id",
  [validateJWT, validateFields],
  deactivateAccount
);

router.patch("/close/:id", [validateJWT, validateFields], closeAccount);

router.get("/by-account-no/:accountNo", [validateJWT], getAccountByAccountNo);

export default router;
