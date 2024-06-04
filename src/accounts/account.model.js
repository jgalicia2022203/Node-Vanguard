import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
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
  status: {
    type: String,
    enum: ["active", "closed", "suspended"],
    default: "active",
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

AccountSchema.index({ account_no: 1 }, { unique: true });

AccountSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

AccountSchema.methods.toJSON = function () {
  const account = this.toObject();
  return account;
};

export default mongoose.model("Account", AccountSchema);
