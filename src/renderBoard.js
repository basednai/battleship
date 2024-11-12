export function RenderGB(instance) {
  let size = instance.board.board.length;
  let board = instance.board;

    function render() {

    const playerDivGrid = document.querySelector(
      "." + instance.name + "Div" + ">" + ".playerDivGrid"
    );

    for (let x = size - 1; x > -1; x--) {
      for (let y = 0; y < size; y++) {
        let square = document.createElement("div");
          square.classList.add(`${instance.name}Square`);
          square.classList.add(`square`);
        square.setAttribute("data-coordinates", [y, x]);
        playerDivGrid.appendChild(square);


      }
    }
  }
  return {
    render,
  };
}
