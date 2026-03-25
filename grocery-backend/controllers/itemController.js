const Item = require('../models/Item');

// @desc    Get all grocery items (latest first)
// @route   GET /api/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stats: total, purchased, pending
// @route   GET /api/items/stats
const getStats = async (req, res) => {
  try {
    const total = await Item.countDocuments();
    const purchased = await Item.countDocuments({ purchased: true });
    const pending = await Item.countDocuments({ purchased: false });

    res.status(200).json({
      success: true,
      data: { total, purchased, pending },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new grocery item
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { name, quantity, unit, category } = req.body;

    // Basic validation
    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Name and quantity are required',
      });
    }

    const item = await Item.create({ name, quantity, unit, category });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a grocery item (e.g. toggle purchased, edit fields)
// @route   PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc + validate
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a grocery item
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllItems,
  getStats,
  createItem,
  updateItem,
  deleteItem,
};