import { Router } from "express";
import { check } from "express-validator";
import { govIdExists } from "../common/helpers/gov-id-exists.js";
import { usernameExists } from "../common/helpers/username-exists.js";
import { validateEditCustomer } from "../common/middlewares/validate-edit-customer.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import {
  createCustomer,
  editCustomerInfo,
  getCustomerById,
} from "./customer.controller.js";

const router = Router();

// ADMIN ROUTES
router.get("/:id", [validateJWT, validateFields], getCustomerById);

router.post(
  "/",
  [
    validateJWT,

    check("name", "The name is required").not().isEmpty(),
    check("username", "The username is required")
      .not()
      .isEmpty()
      .custom(usernameExists),
    check("gov_id", "The gov_id is required")
      .not()
      .isEmpty()
      .custom(govIdExists),
    check("address.street", "The street is required").not().isEmpty(),
    check("address.city", "The city is required").not().isEmpty(),
    check("address.state", "The state is required").not().isEmpty(),
    check("address.zip", "The zip code is required").not().isEmpty(),
    check("cell_phone", "The cell_phone is required").not().isEmpty(),
    check("email_address", "The email_address is required").not().isEmpty(),
    check("password", "The password is required").not().isEmpty(),
    check("work_name", "The work_name is required").not().isEmpty(),
    check(
      "monthly_income",
      "The monthly_income is required and must be at least 100"
    ).isFloat({ min: 100 }),
    validateFields,
  ],
  createCustomer
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "The name is required").optional().not().isEmpty(),
    check("username", "The username is required")
      .optional()
      .not()
      .isEmpty()
      .custom(usernameExists),
    check("address.street", "The street is required")
      .optional()
      .not()
      .isEmpty(),
    check("address.city", "The city is required").optional().not().isEmpty(),
    check("address.state", "The state is required").optional().not().isEmpty(),
    check("address.zip", "The zip code is required").optional().not().isEmpty(),
    check("cell_phone", "The cell_phone is required")
      .optional()
      .not()
      .isEmpty(),
    check("email_address", "The email_address is required")
      .optional()
      .not()
      .isEmpty(),
    check("work_name", "The work_name is required").optional().not().isEmpty(),
    check(
      "monthly_income",
      "The monthly_income is required and must be at least 100"
    )
      .optional()
      .isFloat({ min: 100 }),
    validateEditCustomer,
    validateFields,
  ],
  editCustomerInfo
);

export default router;
