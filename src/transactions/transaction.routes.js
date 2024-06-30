import { Router } from "express";
import {
  deposit,
  getTransactionHistory,
  purchase,
  requestCredit,
  transfer,
  withdraw,
} from "./transaction.controller.js";

const router = Router();

router.get("/:account_no", getTransactionHistory);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.post("/credit", requestCredit);
router.post("/purchase", purchase);

export default router;
