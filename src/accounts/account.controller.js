import mongoose from "mongoose";
import Account from "../accounts/account.model.js";
import Transaction from "../transactions/transaction.model.js";
// Obtener información de una cuenta por ID
export const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findById(id).populate("customer_id");
    if (!account) {
      return res.status(404).json({ msg: "Account not found." });
    }

    // Obtener los últimos 5 movimientos de la cuenta
    const transactions = await Transaction.find({
      account_no: account.account_no,
    })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({ account, transactions });
  } catch (error) {
    console.error("Error in getAccountById:", error);
    res.status(500).json({ msg: "An unexpected error occurred." });
  }
};

export const listAccountsByTransactions = async (req, res) => {
  try {
    const accounts = await Account.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "account_no",
          foreignField: "account_no",
          as: "transactions",
        },
      },
      {
        $addFields: {
          transactionCount: { $size: "$transactions" },
        },
      },
      {
        $sort: { transactionCount: -1 },
      },
      {
        $project: {
          _id: 1,
          account_no: 1,
          balance: 1,
          status: 1,
          transactionCount: 1,
        },
      },
    ]);

    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An unexpected error occurred." });
  }
};

// Desactivar una cuenta (cambiar el estado a "deactivated")
export const deactivateAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { status: "deactivated" },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ msg: "Account not found." });
    }

    res.status(200).json({ msg: "Account deactivated successfully.", account });
  } catch (error) {
    console.error("Error in deactivateAccount:", error);
    res.status(500).json({ msg: "An unexpected error occurred." });
  }
};

// Cerrar una cuenta (cambiar el estado a "closed")
export const closeAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findByIdAndUpdate(
      id,
      { status: "closed" },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ msg: "Account not found." });
    }

    res.status(200).json({ msg: "Account closed successfully.", account });
  } catch (error) {
    console.error("Error in closeAccount:", error);
    res.status(500).json({ msg: "An unexpected error occurred." });
  }
};

// Buscar cuentas por número de cuenta o ID usando expresiones regulares
export const searchAccounts = async (req, res) => {
  const { query } = req.query;

  try {
    // Si el query es un ObjectId válido, buscar por _id
    if (mongoose.Types.ObjectId.isValid(query)) {
      const accounts = await Account.find({
        _id: query,
      }).exec();
      return res.status(200).json(accounts);
    }

    // Si no es un ObjectId válido, buscar usando expresiones regulares
    const accounts = await Account.find({
      $or: [{ account_no: { $regex: query, $options: "i" } }],
    }).exec();

    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error in searchAccounts:", error);
    res.status(500).json({ msg: "An unexpected error occurred." });
  }
};

export const getAccountByAccountNo = async (req, res) => {
  const { accountNo } = req.params;
  try {
    const account = await Account.findOne({ account_no: accountNo }).populate(
      "customer_id"
    );
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const transactions = await Transaction.find({ account_no: accountNo })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({ account, transactions });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Error fetching account" });
  }
};
