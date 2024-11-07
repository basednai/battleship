import { Gameboard } from "./gameboard.js";
import { RenderGB } from "../renderBoard.js";

export class Player {
  constructor(num) {
    this.num = num;
    RenderGB(this).render();
  }
  board = new Gameboard();

  placeShips() {

    

  }
}
