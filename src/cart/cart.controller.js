import Account from "../accounts/account.model.js";
import ProductService from "../products-services/product-service.model.js";
import Transaction from "../transactions/transaction.model.js";
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

export const getCartItems = async (req, res) => {
  try {
    const { id: customer_id } = req.params;
    let cart = await Cart.findOne({ customer_id }).populate(
      "items.product_service_id"
    );

    if (!cart) {
      cart = new Cart({ customer_id, items: [] });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Error fetching cart items" });
  }
};

export const purchase = async (req, res) => {
  try {
    const { account_no } = req.body;
    const account = await Account.findOne({ account_no });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const cart = await Cart.findOne({
      customer_id: account.customer_id,
    }).populate("items.product_service_id");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.quantity * item.product_service_id.price;
    }

    if (account.balance < totalAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    account.balance -= totalAmount;
    await account.save();

    const transactions = cart.items.map((item) => ({
      account_no: account_no,
      transaction_type: "Purchase",
      amount: item.quantity * item.product_service_id.price,
      description: `Purchased ${item.quantity} x ${item.product_service_id.name}`,
    }));
    await Transaction.insertMany(transactions);

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Purchase successful" });
  } catch (error) {
    console.error("Error making purchase:", error);
    res.status(500).json({ error: "Error making purchase" });
  }
};
