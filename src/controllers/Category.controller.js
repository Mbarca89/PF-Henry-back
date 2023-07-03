import Category from "../models/Category.js";

const postCategory = async (req, res) => {
  try {
    const { categoryName, product } = req.body; // Change 'body' to 'req.body'

    const newCategory = await Category.create({
      categoryName,
    });

    res.status(201).send('Categoría creada correctamente!');
  } catch (error) {
    res.status(400).send(error.message)
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      throw Error("Error al obtener categorias!");
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw Error("Categoría no encontrada!");
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, categoryName } = req.body;

    if(!id) throw Error ('Falta la ID de la categoría')

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      throw Error("Categoría no encontrada!");
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw Error("Categoría no encontrada!");
    }

    return res
      .status(200)
      .json({ message: "Categoría eliminada correctamente." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export {
  postCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
