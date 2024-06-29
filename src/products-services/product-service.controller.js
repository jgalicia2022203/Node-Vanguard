import ProductService from "./product-service.model.js";

export const listProductServices = async (req, res) => {
  try {
    const productsAndServices = await ProductService.find();
    res.status(200).json(productsAndServices);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products and services" });
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
  try {
    const productService = new ProductService(req.body);
    await productService.save();
    res.status(201).json(productService);
  } catch (error) {
    res.status(500).json({ error: "Error creating product or service" });
  }
};

export const updateProductService = async (req, res) => {
  try {
    const productService = await ProductService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!productService)
      return res.status(404).json({ error: "Product or service not found" });
    res.status(200).json(productService);
  } catch (error) {
    res.status(500).json({ error: "Error updating product or service" });
  }
};

export const discontinueProductService = async (req, res) => {
  try {
    const productService = await ProductService.findByIdAndUpdate(
      req.params.id,
      { status: "discontinued" },
      { new: true }
    );
    if (!productService)
      return res.status(404).json({ error: "Product or service not found" });
    res.status(200).json(productService);
  } catch (error) {
    res.status(500).json({ error: "Error discontinuing product or service" });
  }
};
