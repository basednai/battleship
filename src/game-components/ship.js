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
