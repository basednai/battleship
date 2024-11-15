import "./styles/styles.css";
import { Player } from "./game-components/player.js";
import { Ship } from "./game-components/ship.js";

let playerOne = new Player("playerOne");
let playerTwo = new Player("playerTwo");

// playerOne.placeShips([4, 3], [4, 6]);
// playerTwo.placeShips([1, 1], [3, 1]);

class GameController {
  constructor() {
    document.addEventListener("startTurn", this.startTurn.bind(this));
    document.addEventListener("endTurn", this.endTurn.bind(this));

    this.boardListener(playerTwo);
  }
  gameLog = document.querySelector(".gameLog");
  playerOneBoard = document.querySelector("[data-playeronegrid]");
  playerTurn = playerTwo;
  playerTurnElement = document.querySelector(".playerTurn");
  wait = false;
    firstMove = true;
    gameStarted = false

  startTurn(event) {
    this.firstMove = false;
    document.querySelector("#placeShips").style.display = "none";
    document.querySelector("#startGame").style.display = "none";

    if (this.checkWin()) return;

    const currentPlayer = event.detail.player;
    const enemy = currentPlayer === playerOne ? playerTwo : playerOne;

    const coords = event.detail.coords;

    const grid = document.querySelector(`[data-${enemy.name}grid]`);

    const square = grid.querySelector(`[data-coordinates="${coords}"]`);
    let attack = enemy.takeAttack(coords);

    if (attack) {
      square.setAttribute("style", "background-color: green;");
    } else {
      square.setAttribute("style", "background-color: grey;");
    }

    square.setAttribute("data-clicked", true);

    console.log(
      `${this.getName(currentPlayer)} attack at [${coords[0]}, ${
        coords[1]
      }] - ${attack ? "hit" : "miss"}`
    );

    const logEntry = document.createElement("li");
    logEntry.classList.add(attack ? "hitEntry" : "missEntry");
    logEntry.innerHTML = `${this.getName(currentPlayer)} attack at [${
      coords[0]
    }, ${coords[1]}] - ${attack ? "hit" : "miss"}`;
    this.gameLog.appendChild(logEntry);
    logEntry.scrollIntoView();

    document.dispatchEvent(
      new CustomEvent("endTurn", { detail: { currentPlayer: currentPlayer } })
    );
  }

  endTurn(event) {
    if (this.checkWin()) return;

    let nextPlayer = this.firstMove
      ? playerOne
      : event.detail.currentPlayer === playerOne
      ? playerTwo
      : playerOne;

    this.playerTurn = nextPlayer;
    this.playerTurnElement.innerHTML =
      nextPlayer == playerOne
        ? `<strong>${this.getName(nextPlayer)} Turn</strong>`
        : `${this.getName(nextPlayer)} calculating move...`;

    //if playerTwo turn trigger CPU
    if (nextPlayer == playerTwo && !this.firstMove) {
      console.log("cpu choosing ...");
      this.wait = true;

      let coords = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];

      let cpuSquare = this.playerOneBoard.querySelector(
        `[data-coordinates="${coords}"]`
      );

      console.log(coords, cpuSquare, cpuSquare.getAttribute("data-clicked"));

      while (cpuSquare && cpuSquare.getAttribute("data-clicked") == "true") {
        coords = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];

        cpuSquare = this.playerOneBoard.querySelector(
          `[data-coordinates="${coords}"]`
        );
        console.log(
          "NEW COORDS",
          coords,
          cpuSquare,
          cpuSquare.getAttribute("data-clicked")
        );
      }

      cpuSquare.classList.add("squareHover");

      setTimeout(() => {
        cpuSquare.classList.remove("squareHover");
        this.wait = false;
        //start turn for cpu
        document.dispatchEvent(
          new CustomEvent("startTurn", {
            detail: {
              player: this.playerTurn,
              coords: coords,
            },
          })
        );
      }, 1000);
    }
  }

  boardListener(player) {
    const grid = document.querySelectorAll(`.${player.name}Square`);

    grid.forEach((square) => {
      square.addEventListener("click", () => {
        let [x, y] = square.getAttribute("data-coordinates").split(",");
        (x = Number(x)), (y = Number(y));

        if (
          square.classList[0] != `${this.playerTurn.name}Square` &&
          square.getAttribute("data-clicked") != "true" &&
          !this.wait
        ) {
          document.dispatchEvent(
            new CustomEvent("startTurn", {
              detail: {
                player: this.playerTurn,
                coords: [x, y],
              },
            })
          );
        } else {
          console.log("wrong square");
          if (
           !this.gameStarted
          ) {
            alert("Must start game, hit play button!");
          }
        }
      });

      square.addEventListener("mouseover", () => {
        if (square.getAttribute("data-clicked") != "true") {
          square.classList.add("squareHover");
        }
      });

      square.addEventListener("mouseout", () => {
        if (square.getAttribute("data-clicked") != "true") {
          square.classList.remove("squareHover");
        }
      });
    });

    document.querySelector("#placeShips").addEventListener("click", () => {
      this.randomShips(playerOne);
    });
  }

  randomShips(player) {
    player.board.clearBoard();

    for (let i = 0; i < 5; i++) {
      player.board.randomPlacement();
    }

    const grid = document.querySelectorAll(`.${player.name}Square`);
    if (player == playerOne) {
      grid.forEach((square) => {
        let [x, y] = square.getAttribute("data-coordinates").split(",");
        (x = Number(x)), (y = Number(y));

        if (player.board.board[x][y] instanceof Ship) {
          square.setAttribute("style", "background-color: red;");
        } else {
          square.setAttribute("style", "background-color: white;");
        }
      });
    }
  }

  getName(player) {
    console.log(player.name);

    return player.name == "playerOne" ? "Player 1" : "Player 2";
  }

  checkWin() {
    if (playerOne.gameOver() || playerTwo.gameOver()) {
      const winMsg = `Game Over ${this.playerTurn.name} VICTORY`;
      let gameLogWin = document.createElement("li");
      gameLogWin.textContent = winMsg;
      gameLogWin.classList.add("hitEntry");
      this.playerTurnElement.classList.add("hitEntry");

      this.gameLog.appendChild(gameLogWin);
      gameLogWin.scrollIntoView();
      this.playerTurnElement.innerHTML = winMsg;

      this.wait = true;
      return true;
    }
  }

  startGame() {
    // fix restart / random piece behavior
    document.querySelector("#restartGame").style.display = "block";
    document.querySelector("#startGame").style.display = "none";
    document.querySelector("#placeShips").style.display = "none";

    this.firstMove = true;
    let allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) => {
      square.setAttribute("data-clicked", "false");
    });

    if (playerOne.gameOver() || !this.firstMove) {
      this.randomShips(playerOne);
    }

    this.randomShips(playerTwo);

    this.gameLog.innerHTML = "";

    document.dispatchEvent(
      new CustomEvent("endTurn", {
        detail: { currentPlayer: gameController.playerTurn },
      })
    );

      this.gameStarted = true
  }

    restartGame() {
      this.gameStarted = false
    playerOne.board.clearBoard();
    playerTwo.board.clearBoard();
    this.gameLog.innerHTML = "";

    const grid = document.querySelectorAll(`.square`);
    grid.forEach((square) => {
      let [x, y] = square.getAttribute("data-coordinates").split(",");
      (x = Number(x)), (y = Number(y));
      if (square.classList.contains("playerOneSquare")) {
        if (square instanceof Ship) {
          square.setAttribute("style", "background-color: red;");
        } else {
          square.setAttribute("style", "background-color: white;");
        }
      } else square.setAttribute("style", "background-color: white;");
    });

    document.querySelector("#startGame").style.display = "block";
    document.querySelector("#placeShips").style.display = "block";

    this.playerTurn = playerTwo;
    this.wait = false;
    this.firstMove = true;
  }
}

const gameController = new GameController();

document.querySelector("#startGame").addEventListener("click", () => {
  gameController.startGame();
});
document.querySelector("#restartGame").addEventListener("click", () => {
  gameController.restartGame();
});

document.querySelector("#restartGame").style.display = "none";

window.playerOne = playerOne;
window.playerTwo = playerTwo;
