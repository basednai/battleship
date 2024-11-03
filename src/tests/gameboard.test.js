import { Gameboard } from "../game-components/gameboard";
import { Ship } from "../game-components/ship";

const testBoard = Gameboard();
const testShip = new Ship();
testBoard.placeShip(testShip, [1, 1], [4, 1]);

test("ship placement", () => {
  expect(testBoard.board[1][1]).toBe(testShip);
  expect(testBoard.board[2][1]).toBe(testShip);
  expect(testBoard.board[3][1]).toBe(testShip);
  expect(testBoard.board[4][1]).not.toBe(testShip);
});

test("receive attack - double hit", () => {
  expect(testBoard.receiveAttack([1, 1])).toBe(true);
  expect(testBoard.board[1][1]).toBe(1);
  expect(testBoard.receiveAttack([1, 1])).toBe(false);
  expect(testBoard.board[1][1]).toBe(1);
  expect(testShip.hits).toBe(1);
  expect(testBoard.misses).toEqual([]);
});

test("receive attack - miss", () => {
  expect(testBoard.receiveAttack([0, 1])).toBe(false);
  expect(testBoard.board[0][1]).toBe(null);
  expect(testBoard.receiveAttack([8, 1])).toBe(false);
  expect(testBoard.board[8][1]).toBe(null);
  expect(testShip.hits).toBe(1);
  expect(testBoard.misses).toContainEqual([0, 1]);
});

test("all sunk", () => {
  expect(testBoard.allShipsSunk()).toBe(false);
  testBoard.receiveAttack([2, 1]);
  testBoard.receiveAttack([3, 1]);
  expect(testBoard.allShipsSunk()).toBe(true);
});
