import Customer from "../../customers/customer.model.js";

export const validateEditCustomer = async (req, res, next) => {
  const { gov_id, password, ...rest } = req.body;

  if (gov_id) {
    return res.status(400).json({ msg: "You cannot change the gov_id" });
  }

  if (password) {
    return res.status(400).json({ msg: "You cannot change the password" });
  }

  // Verificar si el usuario a editar es un administrador
  const customer = await Customer.findById(req.params.id);
  if (customer && customer.role === "admin") {
    return res.status(403).json({ msg: "You cannot edit an admin" });
  }

  req.body = rest;
  next();
};
