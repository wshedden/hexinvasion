const express = require('express');
const router = express.Router();
const { createHexGrid } = require('../game/grid');
const { GRID_SIZE } = require('../utils/constants');

// Create the grid
const grid = createHexGrid(GRID_SIZE, (q, r, size) => Math.abs(q + r) <= size);

// Route to get the grid
router.get('/grid', (req, res) => {
    console.log('Grid requested');
    res.json(grid);
});

module.exports = router;