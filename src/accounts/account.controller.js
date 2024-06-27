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
    const accounts = await Transaction.aggregate([
      { $group: { _id: "$account_no", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
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
