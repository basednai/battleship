import { Ship } from "./ship.js";

export function Gameboard() {
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  let misses = [];
  let ships = [];
  return {
    board,
    misses,
    placeShip: function (ship, [startX, startY], [endX, endY]) {
      //add check for board bounds
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
          board[startX][startY] = ship;

          if (horizontal) {
            startX++;
          } else {
            startY++;
          }
        }
      }
      ships.push(ship);
      return true;
    },
    receiveAttack: function (coords) {
      // 0 = miss, 1 = hit, empty = null
      let [x, y] = coords;
      let square = board[x][y];

      if (misses.includes(coords) || square == 1) {
        return false;
      } else if (square == 1) {
        return false;
      } else if (square instanceof Ship) {
        square.hit();
        board[x][y] = 1;
        return true;
      } else {
        misses.push(coords);
        // don't modify hits
        square = 0;
        return false;
      }
    },
    allShipsSunk: function () {
      return ships.every((ship) => ship.isSunk());
    },
  };
}
