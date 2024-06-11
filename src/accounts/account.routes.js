import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createAccount,
  deleteAccount,
  editAccountInfo,
  getAccountById,
  listAccounts,
} from "./account.controller.js";

const router = Router();

router.get("/", [validateJWT, validateFields], listAccounts);
router.get("/:id", [validateJWT, validateFields], getAccountById);
router.post("/", [validateJWT, validateFields], createAccount);
router.put("/:id", [validateJWT, validateFields], editAccountInfo);
router.delete("/:id", [validateJWT, validateFields], deleteAccount);

export default router;
