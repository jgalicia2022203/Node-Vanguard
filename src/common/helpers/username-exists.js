import Customer from "../../customers/customer.model.js";

export const usernameExists = async (username = "", { req }) => {
  const existingUser = await Customer.findOne({ username });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error(`The username ${username} is already registered`);
  }
};
