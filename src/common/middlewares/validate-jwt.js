import jwt from "jsonwebtoken";
import Account from "../../accounts/account.model.js";
import Customer from "../../customers/customer.model.js"

export const validateJWT = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["auth"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    const { uid } = jwt.verify(token, process.env.TOKEN_KEY);

    const customer = await Customer.findById(uid);

    if (!customer) {
      return res.status(401).json({
        msg: "Customer does not exist in the DB",
      });
    }

    const account = await Account.findOne({ customer_id: customer._id });

    if (!account) {
      return res.status(401).json({
        msg: "Account does not exist in the DB",
      });
    }

    if (account.status === "closed") {
      return res.status(401).json({
        msg: "This account was closed",
      });
    }

    if (account.status === "deactivated") {
      return res.status(401).json({
        msg: "This account was deactivated",
      });
    }

    req.customer = customer;
    req.account = account;

    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).send("Invalid Token");
  }
};

export default validateJWT;
