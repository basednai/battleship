/* export function Ship(length = 3) {
  let hits = 0;
  let sunk = false;
  return {
    _type: "Ship",
    length,
    hit: () => ++hits,
    isSunk: function () {
      return this.hits >= length ? true : false;
    },
    get hits() {
      return hits;
    },
  };
}
 */
export class Ship {
  constructor(length = 3) {
    this.length = length;
  }

  hits = 0;

  hit = () => ++this.hits;
  isSunk() {
    return this.hits >= this.length ? true : false;
  }
}
