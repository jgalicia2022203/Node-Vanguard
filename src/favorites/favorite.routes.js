import { Router } from "express";
import { check } from "express-validator";
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

router.post(
  "/",
  [
    validateJWT,
    check("account_no", "The account_no is required").not().isEmpty(),
    check("favorite_account_no", "The favorite_account_no is required")
      .not()
      .isEmpty(),
    check("alias", "The alias is required").not().isEmpty(),
    validateFields,
  ],
  createFavorite
);

router.put(
  "/:id",
  [
    validateJWT,
    check("favorite_account_no", "The favorite_account_no is required")
      .optional()
      .not()
      .isEmpty(),
    check("alias", "The alias is required").optional().not().isEmpty(),
    validateFields,
  ],
  editFavoriteInfo
);

router.delete("/:id", [validateJWT, validateFields], deleteFavorite);

export default router;
