import express from "express";
import { addItemToCart } from "../cart/cart.controller.js";
import {
  createProductService,
  discontinueProductService,
  getProductServiceById,
  listProductServices,
  updateProductService,
} from "./product-service.controller.js";

const router = express.Router();

// Productos y Servicios
router.get("/", listProductServices);
router.get("/:id", getProductServiceById);
router.post("/", createProductService);
router.put("/:id", updateProductService);
router.patch("/discontinue/:id", discontinueProductService);

// Carrito de Compras
router.post("/cart", addItemToCart);

export default router;
