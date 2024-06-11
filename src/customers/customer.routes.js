import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createCustomer,
  deleteCustomer,
  editCustomerInfo,
  getCustomerById,
  listCustomers,
} from "./customer.controller.js";

const router = Router();

router.get("/", [validateJWT, validateFields], listCustomers);
router.get("/:id", [validateJWT, validateFields], getCustomerById);
router.post("/", [validateJWT, validateFields], createCustomer);
router.put("/:id", [validateJWT, validateFields], editCustomerInfo);
router.delete("/:id", [validateJWT, validateFields], deleteCustomer);

export default router;
