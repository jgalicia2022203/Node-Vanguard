import jwt from "jsonwebtoken";
import Account from "../../accounts/account.model.js";

export const validateJWT = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["auth"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    const { uid } = jwt.verify(token, process.env.TOKEN_KEY);

    const account = await Account.findById(uid);

    if (!account) {
      return res.status(401).json({
        msg: "Account not registered in the database",
      });
    }

    if (!account.status) {
      return res.status(401).json({
        msg: "This account is deactivated",
      });
    }

    req.account = account;

    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).send("Invalid Token");
  }
};

export default validateJWT;
