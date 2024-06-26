import Customer from "../../customers/customer.model.js";

export const govIdExists = async (gov_id = "") => {
  const exists = await Customer.findOne({ gov_id });
  if (exists) {
    throw new Error(`The gov_id: ${gov_id} is already registered`);
  }
};
