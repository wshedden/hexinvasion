.gitignore
package.json
public/
    decisionLogic.js
    gameLoop.js
    index.html
    script.js
    styles.css
pythontest.py
setup_hexinvasion.sh
src/
    api/
        factionRoutes.js
        gridRoutes.js
    db/
        data.json
        db.js
    game/
        cell.js
        cells.js
        creature.js
        factions.js
        grid.js
    server.js
    utils/
        constants.js
        decisionLogic.js
        factionLogic.js
        math.js
        uiUtils.js
    utils.js
test/
    api/
        gridRoutes.test.js
    game/
        factions.test.js
        grid.test.js

## Technical Overview

HexInvasion is a hexagonal grid-based game where factions claim tiles and compete for dominance. The project is divided into front-end and back-end components, each with specific responsibilities.

### Front-End

The front-end is responsible for rendering the hexagonal grid and handling user interactions. It is built using HTML, CSS, and JavaScript, and includes the following key functionalities:

- **Drawing the Grid**: The grid is drawn on an HTML canvas element. Each cell is represented as a hexagon, and the grid is centered on the canvas.
- **Cell Interaction**: Users can click on cells to view detailed information about them, such as coordinates, faction, owner, fertility, population, soldiers, wealth, and whether the cell is threatened.
- **Faction Information**: A panel displays information about each faction, including the number of cells claimed, total population, and total soldiers.
- **Game Loop**: The game loop updates the state of the grid periodically, including deciding the best moves for factions and moving soldiers to contested tiles.

### Back-End

The back-end is built using Express.js and provides APIs to manage the game state. It includes the following key functionalities:

- **Grid Management**: The back-end initializes and manages the hexagonal grid, including creating cells and setting their properties.
- **Faction Management**: The back-end handles faction-related logic, such as claiming cells and moving soldiers.
- **API Endpoints**: The back-end exposes API endpoints to retrieve the grid state and perform actions such as claiming cells.

### How It Works

1. **Grid Initialization**: The grid is created using the `createHexGrid` function in [src/game/grid.js](src/game/grid.js). This function generates a hexagonal grid based on the specified size and shape.
2. **Cell Management**: Each cell is represented by the `Cell` class in [src/game/cell.js](src/game/cell.js). Cells have properties such as coordinates, faction, owner, fertility, population, soldiers, and neighbors.
3. **Faction Logic**: Faction-related logic, such as claiming cells and moving soldiers, is handled by functions in [src/utils/factionLogic.js](src/utils/factionLogic.js).
4. **Game Loop**: The game loop, implemented in [public/gameLoop.js](public/gameLoop.js), periodically updates the state of the grid. It decides the best moves for factions, moves soldiers to contested tiles, and increases the population of occupied cells.
5. **User Interaction**: User interactions, such as clicking on cells and viewing faction information, are handled by functions in [public/script.js](public/script.js) and [src/utils/uiUtils.js](src/utils/uiUtils.js).
6. **API Endpoints**: The back-end exposes API endpoints to retrieve the grid state and perform actions such as claiming cells. These endpoints are defined in [src/api/gridRoutes.js](src/api/gridRoutes.js).

By combining these components, HexInvasion provides an interactive and dynamic game experience where factions compete for control of the hexagonal grid.

## Running the Project

To run the project, follow these steps:

1. **Install Dependencies**: Run `npm install` to install the required dependencies.
2. **Start the Server**: Run `npm start` to start the Express.js server.
3. **Open the Front-End**: Open `http://localhost:3000` in your web browser to view the front-end.

## Development

For development, you can use the following commands:

- **Start the Server in Development Mode**: Run `npm run dev` to start the server with nodemon for automatic restarts.
- **Run Tests**: Run `npm test` to execute the test suite.
- **Live Reload**: Run `npm run live` to start a live server for the front-end with automatic reloading.

## License

This project is licensed under the ISC License.
