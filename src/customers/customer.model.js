import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  gov_id: {
    type: String,
    required: [true, "identification is required"],
    unique: true,
  },
  address: {
    street: { type: String, required: [true, "street is required"] },
    city: { type: String, required: [true, "city is required"] },
    state: { type: String, required: [true, "state is required"] },
    zip: { type: String, required: [true, "zip code is required"] },
  },
  cell_phone: {
    type: String,
    required: [true, "cellphone is required"],
  },
  email_address: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  work_name: {
    type: String,
    required: [true, "work name is required"],
  },
  monthly_income: {
    type: Number,
    required: [true, "monthly income is required"],
    min: [100, "your monthly income must be at least 100 to create an account"],
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
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

CustomerSchema.index({ username: 1 }, { unique: true });
CustomerSchema.index({ email_address: 1 }, { unique: true });
CustomerSchema.index({ gov_id: 1 }, { unique: true });

CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

CustomerSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

CustomerSchema.methods.toJSON = function () {
  const customer = this.toObject();
  return customer;
};

export default mongoose.model("Customer", CustomerSchema);
