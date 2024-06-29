import ProductService from "../products-services/product-service.model.js";
import Cart from "./cart.model.js";

export const addItemToCart = async (req, res) => {
  try {
    const { customer_id, product_service_id, quantity } = req.body;

    const productService = await ProductService.findById(product_service_id);
    if (!productService) {
      return res.status(404).json({ error: "Product or service not found" });
    }
    if (
      productService.status === "out of stock" ||
      productService.status === "discontinued"
    ) {
      return res
        .status(400)
        .json({ error: `Product or service is ${productService.status}` });
    }
    if (productService.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient quantity" });
    }

    let cart = await Cart.findOne({ customer_id });
    if (!cart) {
      cart = new Cart({
        customer_id,
        items: [{ product_service_id, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) =>
        item.product_service_id.equals(product_service_id)
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product_service_id, quantity });
      }
    }

    await cart.save();

    productService.quantity -= quantity;
    if (productService.quantity === 0) {
      productService.status = "out of stock";
    }
    await productService.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
};
