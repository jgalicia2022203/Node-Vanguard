import { request, response } from "express";
import Account from "./account.model.js";

// List all accounts with pagination
export const listAccounts = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, accounts] = await Promise.all([
      Account.countDocuments(),
      Account.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, accounts });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during account list." });
  }
};

// Get account by ID
export const getAccountById = async (req, res) => {
  const id = req.params.id;
  try {
    const account = await Account.findById(id).populate("customer_id");
    if (!account) {
      return res.status(404).json({ msg: "Account not found." });
    }
    res.status(200).json({ account });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching account." });
  }
};

// Create a new account
export const createAccount = async (req, res) => {
  const { customer_id, account_no, balance, status } = req.body;

  try {
    const newAccount = new Account({
      customer_id,
      account_no,
      balance,
      status,
    });

    await newAccount.save();
    res
      .status(201)
      .json({ msg: "Account created successfully", account: newAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the account." });
  }
};

// Edit account information
export const editAccountInfo = async (req, res) => {
  const id = req.params.id;
  const { balance, status, ...rest } = req.body;

  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { balance, status, ...rest },
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(200)
      .json({
        msg: `Account ${updatedAccount.account_no} successfully updated!`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the account." });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  const id = req.params.id;

  try {
    await Account.findByIdAndDelete(id);
    res.status(200).json({ msg: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting the account." });
  }
};
