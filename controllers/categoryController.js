const Category = require("../models/Category");

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

/*
// Get Category From Categories
const getCategory = async (req, res) => {
  try {

    const category = await Category.findOne(req.params.name)

    res.status(200).json(category)

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
*/

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category Already Exists" });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) return res.status(400).json({ message: "Category Not Found" });

    res.status(201).json({message: "Category Updated Successfully"},category)
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};