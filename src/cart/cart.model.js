import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "customer_id is required"],
  },
  items: [
    {
      product_service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductService",
        required: [true, "product_service_id is required"],
      },
      quantity: {
        type: Number,
        required: [true, "quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
      added_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

CartSchema.pre("save", async function (next) {
  const cart = this;
  for (const item of cart.items) {
    const productService = await mongoose
      .model("ProductService")
      .findById(item.product_service_id);
    if (!productService) {
      throw new Error(
        `Product or service with id ${item.product_service_id} not found`
      );
    }
    if (
      productService.status === "out of stock" ||
      productService.status === "discontinued"
    ) {
      throw new Error(
        `Product or service ${productService.name} is ${productService.status}`
      );
    }
    if (productService.quantity < item.quantity) {
      throw new Error(`Insufficient quantity for ${productService.name}`);
    }
  }
  next();
});

export default mongoose.model("Cart", CartSchema);
