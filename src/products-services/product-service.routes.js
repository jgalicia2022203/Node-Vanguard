import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createProductService,
  deleteProductService,
  editProductServiceInfo,
  getProductServiceById,
  listProductServices,
} from "./product-service.controller.js";

const router = Router();

router.get("/", [validateJWT, validateFields], listProductServices);
router.get("/:id", [validateJWT, validateFields], getProductServiceById);
router.post("/", [validateJWT, validateFields], createProductService);
router.put("/:id", [validateJWT, validateFields], editProductServiceInfo);
router.delete("/:id", [validateJWT, validateFields], deleteProductService);

export default router;
