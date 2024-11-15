import { Gameboard } from "./gameboard.js";
import { RenderGB } from "../renderBoard.js";

export class Player {
  constructor(name) {
    this.name = name;
    RenderGB(this).render();
  }

  board = new Gameboard();

  placeShips(start, end) {
    this.board.placeShip(start, end);
  }

  gameOver() {
   return this.board.allShipsSunk()
  }

  takeAttack(coords) {
    return this.board.receiveAttack(coords)
  }
}

