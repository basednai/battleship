import { Ship } from "./ship.js";

export function Gameboard() {
  const board = Array.from({ length: 10 }, () => Array(10).fill(0));
    let misses = []
  return {
    board,
    placeShip: function (ship, [startX, startY], [endX, endY]) {
      let horizontal = true;
      //one block width
      if (startX == endX || startY == endY) {
        //only for length of ship
        if (startX != endX) {
          endX = ship.length + 1;
        } else if (startY != endY) {
          endY = ship.length + 1;
          horizontal = false;
        }

        while (startX != endX || startY != endY) {
          board[startX][startY] = 1;

          if (horizontal) {
            startX++;
          } else {
            startY++;
          }
        }
      }

      return true;
    },
    receiveAttack: function () {
      //pass
    },
    test: () => true,
  };
}

const gb = new Gameboard();
