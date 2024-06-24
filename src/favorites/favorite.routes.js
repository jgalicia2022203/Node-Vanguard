import { Router } from "express";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createFavorite,
  deleteFavorite,
  editFavoriteInfo,
  getFavoriteById,
  listFavorites,
} from "./favorite.controller.js";

const router = Router();

router.get("/", [validateJWT, validateFields], listFavorites);
router.get("/:id", [validateJWT, validateFields], getFavoriteById);
router.post("/", [validateJWT, validateFields], createFavorite);
router.put("/:id", [validateJWT, validateFields], editFavoriteInfo);
router.delete("/:id", [validateJWT, validateFields], deleteFavorite);

export default router;
