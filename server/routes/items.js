const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, submitAction } = require('../controllers/itemsController');

router.get('/', getAllItems); // fetch all items for the table
router.get('/:id', getItemById); // fetch one item's full detail
router.post('/:id/action', submitAction); // when some one performs an action on the item 

module.exports = router;