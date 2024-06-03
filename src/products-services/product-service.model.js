import mongoose from "mongoose";

const ProductServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  type: {
    type: String,
    enum: ["product", "service"],
    required: [true, "type is required"],
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

ProductServiceSchema.methods.toJSON = function () {
  const productService = this.toObject();
  return productService;
};

export default mongoose.model("ProductService", ProductServiceSchema);
