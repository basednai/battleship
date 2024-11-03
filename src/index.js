import "./styles/styles.css";
import "./game-components/ship.js";
import "./game-components/gameboard.js";
import { Gameboard } from "./game-components/gameboard.js";
import { Ship } from "./game-components/ship.js";
const testBoard = Gameboard()
const testShip = new Ship()

testBoard.placeShip(testShip, [1, 1], [4, 1]);
console.log(testShip.isSunk());
