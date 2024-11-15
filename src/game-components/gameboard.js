import { Ship } from "./ship.js";

export function Gameboard() {
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  let misses = [];
  let ships = [];
  return {
    board,
    misses,
    get ships() {
      return ships
    },
    placeShip: function ([startX, startY], [endX, endY]) {
      //add check for board bounds
      let horizontal = true;
      let ship;
      //one block width
      if (startX == endX || startY == endY) {
        //only for length of ship
        if (startY == endY) {
          ship = new Ship(endX - startX + 1);
        } else if (startX == endX) {
          ship = new Ship(endY - startY + 1);
          horizontal = false;
        } else {
          console.error("Invalid coordinates");
        }
        // console.log([startX, startY], [endX, endY]);

        if (horizontal) {
          while (startX != endX + 1) {
            board[startX][startY] = ship;
            startX++;
          }
        } else {
          while (startY != endY + 1) {
            board[startX][startY] = ship;
            startY++;
          }
        }
      }

      ships.push(ship);
      return true;
    },
    receiveAttack: function (coords) {
      // square value:: 0 = miss, 1 = hit, empty = null
      // true = hit , false = miss/doublehit

      let [x, y] = coords;
      let square = board[x][y];

      if (misses.includes(coords) || square == 1) {
        console.log("already picked");

        return false;
      } else if (square instanceof Ship) {
        square.hit();
        board[x][y] = 1;
        console.log("HIT");
        return true;
      } else {
        misses.push(coords);
        // don't modify hits
        square = 0;
        console.log("miss");
        return false;
      }
    },
    allShipsSunk: function () {
      return ships.every((ship) => ship.isSunk());
    },
    randomPlacement: function () {
      //get random coordinates
      let orientation;
      let startX, endX, startY, endY;
      let x1, x2, y1, y2;
      let pass = false;
      while (pass == false) {
        // get random ship coords
        pass = true;
        do {
          orientation = Math.floor(Math.random() * 2);
          if (orientation) {
            //-
            startX = Math.floor(Math.random() * 10);
            startY = Math.floor(Math.random() * 10);

            endX = startX + Math.floor(Math.random() * (5 - 2 + 1)) + 2;
            endY = startY;
          } else {
            startX = Math.floor(Math.random() * 10);
            startY = Math.floor(Math.random() * 10);

            endX = startX;
            endY = startY + Math.floor(Math.random() * (5 - 2 + 1)) + 2;
          }
        } while (endX > 9 || endY > 9);

        //check for intersections
        (x1 = startX), (x2 = endX), (y1 = startY), (y2 = endY);

        // Check for intersections (overlap with existing ships)
        let tempX = startX; // (changed line)
        let tempY = startY; // (changed line)

        while (tempX != endX || tempY != endY) {
          if (
            board[tempX][tempY] instanceof Ship ||
            board[tempX][tempY] != null
          ) {
            console.error("Overlap detected at:", tempX, tempY);
            pass = false;
            // break;
          }

          // Increment the coordinates based on orientation
          if (orientation) {
            tempX++; // Move horizontally
          } else {
            tempY++; // Move vertically
          }
        }
      }
      console.log([x1, y1], [x2, y2]);

      if (pass) return this.placeShip([x1, y1], [x2, y2]);
    },

    clearBoard: function () {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          board[i][j] = null;
        }
      }
      ships = [];
      console.log("cleared");
    },
  };
}
