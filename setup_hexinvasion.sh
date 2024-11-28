#!/bin/bash

# Ensure we're in the correct directory
if [ ! -f package.json ]; then
  echo "Error: Run this script in a directory with a package.json file (after npm init)."
  exit 1
fi

echo "Setting up HexInvasion project folder structure..."

# Create folder structure
mkdir -p public src/game src/utils src/api src/db test/game test/api

# Create basic files
touch public/index.html public/styles.css public/script.js
touch src/game/grid.js src/game/factions.js src/game/cells.js
touch src/utils/math.js src/utils/constants.js
touch src/api/gridRoutes.js src/api/factionRoutes.js
touch src/db/data.json src/db/db.js
touch src/server.js
touch test/game/grid.test.js test/game/factions.test.js test/api/gridRoutes.test.js

# Add basic content to files
cat > public/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HexInvasion</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>HexInvasion</h1>
    <script src="script.js"></script>
</body>
</html>
EOL

cat > src/server.js <<EOL
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
EOL

cat > src/utils/constants.js <<EOL
const GRID_SIZE = 5; // Hex grid radius

module.exports = { GRID_SIZE };
EOL

cat > src/game/grid.js <<EOL
const { GRID_SIZE } = require('../utils/constants');

function createHexGrid(size) {
    const grid = [];
    for (let q = -size; q <= size; q++) {
        for (let r = -size; r <= size; r++) {
            if (Math.abs(q + r) <= size) {
                grid.push({ q, r, faction: null }); // faction: null = unclaimed
            }
        }
    }
    return grid;
}

function claimCell(grid, q, r, faction) {
    const cell = grid.find(cell => cell.q === q && cell.r === r);
    if (cell && !cell.faction) {
        cell.faction = faction; // Claim the cell for the faction
        return true;
    }
    return false; // Cell already claimed or invalid
}

module.exports = { createHexGrid, claimCell };
EOL

cat > src/game/factions.js <<EOL
const factions = {
    red: { colour: '#FF0000' },
    blue: { colour: '#0000FF' },
};

function getFactionColour(faction) {
    return factions[faction]?.colour || '#CCCCCC'; // Default unclaimed colour
}

module.exports = { factions, getFactionColour };
EOL

cat > public/script.js <<EOL
(async function () {
    console.log('HexInvasion frontend loaded');
})();
EOL

cat > .gitignore <<EOL
node_modules/
.env
EOL

echo "HexInvasion folder structure and basic files created successfully!"

