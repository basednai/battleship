export function RenderGB(instance) {
  let size = instance.board.board.length;
  let board = instance.board;

    function render() {
      
      board.placeShip([1, 1], [9, 1]);

    const playerDivGrid = document.querySelector(
      "." + instance.num + "Div" + ">" + ".playerDivGrid"
    );

    for (let x = size - 1; x > -1; x--) {
      for (let y = 0; y < size; y++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("data-coordinates", [x, y]);
        playerDivGrid.appendChild(square);

        square.addEventListener("mouseover", () => {
          let [x, y] = square.getAttribute("data-coordinates").split(",");
          (x = Number(x)), (y = Number(y));

          let attack = board.receiveAttack([x, y]);

          if (attack) {
            square.setAttribute("style", "background-color: green;");
          } else {
            square.setAttribute("style", "background-color: grey;");
          }
        }, {once : true});
      }
    }
  }
  return {
    render,
  };
}
