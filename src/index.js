import "./styles/styles.css";
import { Player } from "./game-components/player.js";

let playerOne = new Player("playerOne");
let playerTwo = new Player("playerTwo");

playerOne.placeShips([1, 1], [3, 1]);
playerTwo.placeShips([1, 8], [7, 8]);

class GameController {
  constructor() {
    document.addEventListener("startTurn", this.startTurn.bind(this));
    document.addEventListener("endTurn", this.endTurn.bind(this));

    // this.boardListener(playerOne);
    this.boardListener(playerTwo);
  }
  gameLog = document.querySelector(".gameLog");
  playerOneBoard = document.querySelector("[data-playeronegrid]");
  playerTurn = playerTwo;
  playerTurnElement = document.querySelector(".playerTurn");
  wait = false;

  startTurn(event) {
   if ( this.checkWin() ) return

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

    document.dispatchEvent(
      new CustomEvent("endTurn", { detail: { currentPlayer: currentPlayer } })
    );
  }

  endTurn(event) {
    if ( this.checkWin() ) return

    let nextPlayer =
      event.detail.currentPlayer === playerOne ? playerTwo : playerOne;

    this.playerTurn = nextPlayer;
    this.playerTurnElement.innerHTML =
      nextPlayer == playerOne
        ? `<strong>${this.getName(nextPlayer)} Turn</strong>`
        : `${this.getName(nextPlayer)} calculating their move...`;

    //if playerTwo turn trigger CPU
    if (nextPlayer == playerTwo) {
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
        let coords = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];

        cpuSquare = this.playerOneBoard.querySelector(
          `[data-coordinates="${coords}"]`
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
      }, 0);
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
      this.playerTurnElement.innerHTML = winMsg;

      this.wait = true;
      console.log("FIN");
      return true;
    }
  }

}

const gameController = new GameController();

document.dispatchEvent(
  new CustomEvent("endTurn", {
    detail: { currentPlayer: gameController.playerTurn },
  })
);
