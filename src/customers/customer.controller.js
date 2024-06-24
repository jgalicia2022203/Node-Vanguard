import bcrypt from "bcryptjs";
import { request, response } from "express";
import Customer from "./customer.model.js";

// List all customers with pagination
export const listCustomers = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, customers] = await Promise.all([
      Customer.countDocuments(),
      Customer.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, customers });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during customer list." });
  }
};

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
    const newCustomer = new Customer({
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
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ msg: "Customer created successfully", customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the customer." });
  }
};

// Edit customer information
export const editCustomerInfo = async (req, res) => {
  const id = req.params.id;
  const { password, ...rest } = req.body;

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      rest.password = await bcrypt.hash(password, salt);
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: `${updatedCustomer.username} successfully updated!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the customer." });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  const id = req.params.id;

  try {
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ msg: "Customer deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting the customer." });
  }
};
