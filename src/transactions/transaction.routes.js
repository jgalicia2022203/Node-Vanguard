import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  deposit,
  getTransactionHistory,
  purchase,
  requestCredit,
  transfer,
  withdraw,
} from "./transaction.controller.js";

const router = Router();

router.get(
  "/:account_no",
  [validateJWT, validateFields],
  getTransactionHistory
);
router.post(
  "/deposit",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    check("amount", "The amount is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    validateFields,
  ],
  deposit
);
router.post(
  "/withdraw",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    check("amount", "The amount is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    validateFields,
  ],
  withdraw
);
router.post(
  "/transfer",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    check("to_account_no", "The to_account_no is required").not().isEmpty(),
    check("amount", "The amount is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    validateFields,
  ],
  transfer
);
router.post(
  "/credit",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    check("amount", "The amount is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    validateFields,
  ],
  requestCredit
);
router.post(
  "/purchase",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    validateFields,
  ],
  purchase
);

export default router;
