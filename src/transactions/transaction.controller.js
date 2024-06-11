import { request, response } from "express";
import Transaction from "./transaction.model.js";

// List all transactions with pagination
export const listTransactions = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, transactions] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, transactions });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during transaction list." });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found." });
    }
    res.status(200).json({ transaction });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        msg: "An unexpected error occurred during fetching transaction.",
      });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  const {
    account_no,
    transaction_type,
    amount,
    description,
    transaction_date,
  } = req.body;

  try {
    const newTransaction = new Transaction({
      account_no,
      transaction_type,
      amount,
      description,
      transaction_date,
    });

    await newTransaction.save();
    res
      .status(201)
      .json({
        msg: "Transaction created successfully",
        transaction: newTransaction,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the transaction." });
  }
};

// Edit transaction information
export const editTransactionInfo = async (req, res) => {
  const id = req.params.id;
  const { amount, description, transaction_date, ...rest } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, description, transaction_date, ...rest },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ msg: `Transaction successfully updated!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the transaction." });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  const id = req.params.id;

  try {
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ msg: "Transaction deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting the transaction." });
  }
};
