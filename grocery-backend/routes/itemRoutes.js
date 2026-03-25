const express = require('express');
const router = express.Router();

const {
  getAllItems,
  getStats,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

router.get('/stats', getStats);

router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;