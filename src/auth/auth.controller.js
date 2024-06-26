import bcryptjs from "bcryptjs";
import { generateJWT } from "../common/helpers/generate-jwt.js";
import Customer from "../customers/customer.model.js";

// Login
export const auth = async (req, res) => {
  const { username, password } = req.body;

  try {
    const customer = await Customer.findOne({ username });

    if (!customer) {
      return res.status(400).json({
        msg: "Incorrect credentials, username does not exist in the database",
      });
    }

    const validPassword = bcryptjs.compareSync(password, customer.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "The password is incorrect",
      });
    }

    const token = await generateJWT(customer.id);

    res.status(200).json({
      customer,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the administrator",
    });
  }
};
