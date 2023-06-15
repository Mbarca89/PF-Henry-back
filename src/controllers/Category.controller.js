import Category from "../models/Category.js";

const postCategory = async (req, res) => {
  try {
    const { categoryName, product } = req.body; // Change 'body' to 'req.body'

    const newCategory = await Category.create({
      categoryName,
      product,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error postCategory", message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      throw Error("Error al obtener categorias");
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export { postCategory, getAllCategories };
