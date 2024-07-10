import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import Account from "../accounts/account.model.js";
import Customer from "../customers/customer.model.js";

// Get customer by ID
export const getCustomerById = async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ msg: "Customer not found." });
    }
    res.status(200).json({ customer });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching customer." });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  const {
    name,
    username,
    gov_id,
    address,
    cell_phone,
    email_address,
    password,
    work_name,
    monthly_income,
    role,
  } = req.body;

  try {
    // Generate unique account number
    const account_no = uuidv4();
    const newCustomer = new Customer({
      name,
      username,
      account_no,
      gov_id,
      address,
      cell_phone,
      email_address,
      password,
      work_name,
      monthly_income,
      role,
    });

    await newCustomer.save();

    // Create new account for the customer
    const newAccount = new Account({
      customer_id: newCustomer._id,
      account_no: newCustomer.account_no,
    });

    await newAccount.save();

    res.status(201).json({
      msg: "Customer and account created successfully",
      customer: newCustomer,
      account: newAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the customer and account." });
  }
};

export const editCustomerInfo = async (req, res) => {
  const id = req.params.id;
  const { address, ...rest } = req.body;

  if (rest.password) {
    rest.password = await bcrypt.hash(rest.password, 10);
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        ...rest,
        "address.street": address.street,
        "address.city": address.city,
        "address.state": address.state,
        "address.zip": address.zip,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(200)
      .json({ msg: `${updatedCustomer.username} successfully updated!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the customer." });
  }
};
