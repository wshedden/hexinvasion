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

## Front-End Behavior

The front-end of HexInvasion is responsible for rendering the hexagonal grid and handling user interactions. Key functionalities include:

- **Drawing the Grid**: The grid is drawn on an HTML canvas element. Each cell is represented as a hexagon, and the grid is centered on the canvas.
- **Cell Interaction**: Users can click on cells to view detailed information about them, such as coordinates, faction, owner, fertility, population, soldiers, wealth, and whether the cell is threatened.
- **Faction Information**: A panel displays information about each faction, including the number of cells claimed, total population, and total soldiers.
- **Game Loop**: The game loop updates the state of the grid periodically, including deciding the best moves for factions and moving soldiers to contested tiles.

## Back-End Behavior

The back-end of HexInvasion is built using Express.js and provides APIs to manage the game state. Key functionalities include:

- **Grid Management**: The back-end initializes and manages the hexagonal grid, including creating cells and setting their properties.
- **Faction Management**: The back-end handles faction-related logic, such as claiming cells and moving soldiers.
- **API Endpoints**: The back-end exposes API endpoints to retrieve the grid state and perform actions such as claiming cells.

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
