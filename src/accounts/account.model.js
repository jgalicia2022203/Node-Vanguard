import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "customer id is required"],
  },
  account_no: {
    type: String,
    required: [true, "account number is required"],
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.methods.toJSON = function () {
  const account = this.toObject();
  return account;
};

export default mongoose.model("Account", AccountSchema);
