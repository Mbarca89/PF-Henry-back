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

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw Error("Categoría no encontrada");
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, categoryName } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      throw Error("Categoría no encontrada");
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/* const updateCategory = async (req, res) => {
  try {
    const { categoryName, id } = req.body;

    if (!id) throw Error("Id must be provided");

    const category = updateCat(categoryName, id);

    if (category.error) throw Error(category.error);

    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating category", message: error.message });
  }
};

const updateCat = async (categoryName, id) => {
  const category = await getCategoryById(id);

  if (!category) return category;

  category.categoryName = categoryName || category.categoryName;

  // Save the changes to the database
  await category.save();

  return category;
}; */

export { postCategory, getAllCategories, getCategoryById, updateCategory };
