import mongoose from "mongoose";

const ProductServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
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
  status: {
    type: String,
    enum: ["in stock", "out of stock", "discontinued"],
    default: "in stock",
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

ProductServiceSchema.index({ name: 1 }, { unique: true });

ProductServiceSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

ProductServiceSchema.methods.toJSON = function () {
  const productService = this.toObject();
  return productService;
};

export default mongoose.model("ProductService", ProductServiceSchema);
