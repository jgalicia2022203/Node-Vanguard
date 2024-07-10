import ProductService from "./product-service.model.js";

export const listProductServices = async (req, res) => {
  try {
    const products = await ProductService.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const getProductServiceById = async (req, res) => {
  try {
    const productService = await ProductService.findById(req.params.id);
    if (!productService)
      return res.status(404).json({ error: "Product or service not found" });
    res.status(200).json(productService);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product or service" });
  }
};

export const createProductService = async (req, res) => {
  const { name, description, price, imageUrl, type } = req.body;
  try {
    const newProduct = new ProductService({
      name,
      description,
      price,
      imageUrl,
      type,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

export const updateProductService = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedProduct = await ProductService.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: `${updatedProduct.name} successfully updated!` });
  } catch (error) {
    console.error("Error updating the product:", error);
    res.status(500).json({ msg: "Error updating the product." });
  }
};

export const deleteProductService = async (req, res) => {
  const id = req.params.id;
  try {
    await ProductService.findByIdAndDelete(id);
    res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ msg: "Error deleting the product." });
  }
};
