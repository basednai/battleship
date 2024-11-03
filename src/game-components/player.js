import { Gameboard } from "./gameboard";

export class Player {
  constructor(type = "cpu") {
    this.type = type;
  }
  playerBoard = new Gameboard();
}
