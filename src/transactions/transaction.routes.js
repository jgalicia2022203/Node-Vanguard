import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createTransaction,
  deleteTransaction,
  editTransactionInfo,
  getTransactionById,
  listTransactions,
} from "./transaction.controller.js";

const router = Router();

router.get("/", [validateJWT, validateFields], listTransactions);
router.get("/:id", [validateJWT, validateFields], getTransactionById);
router.post("/", [validateJWT, validateFields], createTransaction);
router.put("/:id", [validateJWT, validateFields], editTransactionInfo);
router.delete("/:id", [validateJWT, validateFields], deleteTransaction);

export default router;
