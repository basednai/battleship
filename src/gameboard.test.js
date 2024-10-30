import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

const testBoard = Gameboard()
const testShip = Ship()

test("test1", () => {
    expect(testBoard.test()).toBe(true);
});

test("valid placement", () => {

    expect(testBoard.placeShip(testShip, [1, 1], [4, 1])).toBeTruthy()

  });