import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  account_no: {
    type: String,
    ref: "Account",
    required: [true, "Account number is required"],
  },
  transaction_type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Transfer", "Purchase", "Credit"],
    required: [true, "Transaction type is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: { type: String },
  to_account_no: {
    type: String,
    ref: "Account",
  },
});

TransactionSchema.methods.toJSON = function () {
  const transaction = this.toObject();
  return transaction;
};

export default mongoose.model("Transaction", TransactionSchema);
