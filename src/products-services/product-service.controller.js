import { request, response } from "express";
import ProductService from "./product-service.model.js";

// List all product-services with pagination
export const listProductServices = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, productServices] = await Promise.all([
      ProductService.countDocuments(),
      ProductService.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, productServices });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error occurred during product-service list.",
    });
  }
};

// Get product-service by ID
export const getProductServiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const productService = await ProductService.findById(id);
    if (!productService) {
      return res.status(404).json({ msg: "Product-Service not found." });
    }
    res.status(200).json({ productService });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An unexpected error occurred during fetching product-service.",
    });
  }
};

// Create a new product-service
export const createProductService = async (req, res) => {
  const { name, description, cost, currency, category, status } = req.body;

  try {
    const newProductService = new ProductService({
      name,
      description,
      cost,
      currency,
      category,
      status,
    });

    await newProductService.save();
    res.status(201).json({
      msg: "Product-Service created successfully",
      productService: newProductService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the product-service." });
  }
};

// Edit product-service information
export const editProductServiceInfo = async (req, res) => {
  const id = req.params.id;
  const { status, ...rest } = req.body;

  try {
    const updatedProductService = await ProductService.findByIdAndUpdate(
      id,
      { status, ...rest },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ msg: `Product-Service successfully updated!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the product-service." });
  }
};

// Delete product-service
export const deleteProductService = async (req, res) => {
  const id = req.params.id;

  try {
    await ProductService.findByIdAndDelete(id);
    res.status(200).json({ msg: "Product-Service deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting the product-service." });
  }
};
