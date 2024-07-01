import express from "express";
import { check } from "express-validator";
import { addItemToCart } from "../cart/cart.controller.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createProductService,
  discontinueProductService,
  getProductServiceById,
  listProductServices,
  updateProductService,
} from "./product-service.controller.js";

const router = express.Router();

// Productos y Servicios
router.get("/", [validateJWT, validateFields], listProductServices);

router.get("/:id", [validateJWT, validateFields], getProductServiceById);

router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    check("price", "The price is required").not().isEmpty(),
    check("type", "The type is required").not().isEmpty(),
    validateFields,
  ],
  createProductService
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "The name is required").optional().not().isEmpty(),
    check("description", "The description is required")
      .optional()
      .not()
      .isEmpty(),
    check("price", "The price is required").optional().not().isEmpty(),
    check("type", "The type is required").optional().not().isEmpty(),
    validateFields,
  ],
  updateProductService
);

router.patch(
  "/discontinue/:id",
  [validateJWT, validateFields],
  discontinueProductService
);

// Carrito de Compras
router.post(
  "/cart",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    validateFields,
  ],
  addItemToCart
);

export default router;
