import { Gameboard } from "../game-components/gameboard";
import { Ship } from "../game-components/ship";

const testBoard = Gameboard();
const testShip = new Ship();
console.log(testBoard.placeShip([1, 1], [4, 1]));

test("ship placement", () => {
  expect(testBoard.board[1][1]).toBeInstanceOf(Ship);
  expect(testBoard.board[2][1]).toBeInstanceOf(Ship);
  expect(testBoard.board[3][1]).toBeInstanceOf(Ship);
  expect(testBoard.board[4][1]).not.toBeInstanceOf(Ship);
});

test("receive attack - double hit", () => {
  expect(testBoard.receiveAttack([1, 1])).toBe(true);
  expect(testBoard.board[1][1]).toBe(1);
  expect(testBoard.receiveAttack([1, 1])).toBe(false);
  expect(testBoard.board[1][1]).toBe(1);
  console.log(testBoard.ships);

  expect(testBoard.ships[testBoard.ships.length - 1].hits).toBe(1);
  expect(testBoard.misses).toEqual([]);
});

test("receive attack - miss", () => {
  expect(testBoard.receiveAttack([0, 1])).toBe(false);
  expect(testBoard.board[0][1]).toBe(null);
  expect(testBoard.receiveAttack([8, 1])).toBe(false);
  expect(testBoard.board[8][1]).toBe(null);
  expect(testBoard.ships[testBoard.ships.length - 1].hits).toBe(1);
  expect(testBoard.misses).toContainEqual([0, 1]);
});

test("all sunk", () => {
  expect(testBoard.allShipsSunk()).toBe(false);
  testBoard.receiveAttack([2, 1]);
  testBoard.receiveAttack([3, 1]);
  expect(testBoard.allShipsSunk()).toBe(true);
});
