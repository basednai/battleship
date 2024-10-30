export function Ship(length = 3) {
  let hits = 0;
  let sunk = false;
  return {
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