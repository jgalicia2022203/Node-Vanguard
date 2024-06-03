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
    type: String,
    required: [true, "address is required"],
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
    min: 100,
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

CustomerSchema.methods.toJSON = function () {
  const customer = this.toObject();
  return customer;
};

export default mongoose.model("Customer", CustomerSchema);
