export const validateEditCustomer = (req, res, next) => {
  const { gov_id, password, ...rest } = req.body;

  if (gov_id) {
    return res.status(400).json({ msg: "You cannot change the gov_id" });
  }

  if (password) {
    return res.status(400).json({ msg: "You cannot change the password" });
  }

  req.body = rest;
  next();
};
