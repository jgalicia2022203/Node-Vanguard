import Account from "../accounts/account.model.js";
import Transaction from "./transaction.model.js";

export const getTransactionHistory = async (req, res) => {
  const { account_no } = req.params;
  try {
    const transactions = await Transaction.find({ account_no }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: "Error fetching transaction history" });
  }
};

export const deposit = async (req, res) => {
  const { account_no, amount, description } = req.body;
  try {
    const account = await Account.findOne({ account_no });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const newTransaction = new Transaction({
      account_no,
      transaction_type: "Deposit",
      amount,
      description,
    });
    await newTransaction.save();

    account.balance += Number(amount);
    await account.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error making deposit:", error);
    res.status(500).json({ error: "Error making deposit" });
  }
};

export const withdraw = async (req, res) => {
  const { account_no, amount, description } = req.body;
  try {
    const account = await Account.findOne({ account_no });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const newTransaction = new Transaction({
      account_no,
      transaction_type: "Withdrawal",
      amount,
      description,
    });
    await newTransaction.save();

    account.balance -= amount;
    await account.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error making withdrawal:", error);
    res.status(500).json({ error: "Error making withdrawal" });
  }
};

export const transfer = async (req, res) => {
  const { account_no, to_account_no, amount, description } = req.body;
  try {
    const fromAccount = await Account.findOne({ account_no });
    const toAccount = await Account.findOne({ account_no: to_account_no });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyTransfers = await Transaction.aggregate([
      {
        $match: {
          account_no,
          transaction_type: "Transfer",
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const dailyTotal = dailyTransfers.length ? dailyTransfers[0].total : 0;

    if (dailyTotal + amount > 10000) {
      return res.status(400).json({ error: "Daily transfer limit exceeded" });
    }

    const fromTransaction = new Transaction({
      account_no,
      transaction_type: "Transfer",
      amount,
      description,
      to_account_no,
    });

    const toTransaction = new Transaction({
      account_no: to_account_no,
      transaction_type: "Deposit",
      amount,
      description: `Transfer from ${account_no}`,
    });

    await fromTransaction.save();
    await toTransaction.save();

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    res.status(201).json({ fromTransaction, toTransaction });
  } catch (error) {
    console.error("Error making transfer:", error);
    res.status(500).json({ error: "Error making transfer" });
  }
};

export const requestCredit = async (req, res) => {
  const { account_no, amount, description } = req.body;
  try {
    const account = await Account.findOne({ account_no });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const newTransaction = new Transaction({
      account_no,
      transaction_type: "Credit",
      amount,
      description,
    });
    await newTransaction.save();

    account.balance += Number(amount);
    await account.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error requesting credit:", error);
    res.status(500).json({ error: "Error requesting credit" });
  }
};
