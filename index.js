// Generate the players for the game of tic tac toe
const generatePlayers = () => {
  // Player factory function
  // Returns four functions, one setter, three getters
  const player = (symbol, playerNum) => {
    const playerSymbol = symbol;
    const playerName = playerNum;
    let playerScore = 0;
  
    const getPlayerName = () => playerName;
    const getPlayerSymbol = () => playerSymbol;
    const getPlayerScore = () => playerScore;
    const updatePlayerScore = () => playerScore++;
  
    return ({ getPlayerName, getPlayerSymbol, getPlayerScore, updatePlayerScore });
  }

  const player1 = player("X", 1);
  const player2 = player("O", 2);

  let playerFlag = true;

  const getCurrentPlayer = () => {
    if (playerFlag) {
      return player1;
    }

    return player2;
  }

  const swapPlayers = () => playerFlag = !playerFlag;
  const getPlayers = () => [player1, player2];

  return ({ getCurrentPlayer, getPlayers, swapPlayers })
}

// Generate the board for the game
// Has functions to place a mark, and check rows for winners
const board = () => {
  let board = [
    [ null, null, null ],
    [ null, null, null ],
    [ null, null, null ],
  ]
  let numTurns = 0;

  const getBoard = () => board;
  const getNumTurns = () => numTurns;

  const increaseNumTurns = () => numTurns++;

  const placeMark = (symbol, rowNum, colNum) => {
    if (board[rowNum][colNum] !== null) {
      return false;
    }
    board[rowNum][colNum] = symbol;
    return true;
  }

  const checkForWinner = () => {
    const checkRows = () => {
      for (let row of board) {
        if ((row[0] === row[1] && row[1] === row[2]) && (row[0] !== null)) {
          return true;
        }
      }

      return false;
    }

    const checkColumns = () => {
      for (let i = 0; i < board.length; i++) {
        if ((board[0][i] === board[1][i] && board[1][i] === board[2][i]) && (board[0][i] !== null)) {
          return true;
        }
      }

      return false;
    }

    const checkDiagonals = () => {
      if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && (board[0][0] !== null)) {
        return true;
      }

      if ((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && (board[0][2] !== null)) {
        return true;
      }

      return false;
    }

    if (checkRows() || checkColumns() || checkDiagonals()) {
      return true;
    }
  }

  return ({ getBoard, placeMark, checkForWinner, getNumTurns, increaseNumTurns })
}

function generateHTMLGrid(players, gameBoard) {
  const container = document.querySelector(".container");
  const player1 = players.getPlayers()[0];
  const player2 = players.getPlayers()[1];

  // Clear the content div
  container.removeChild(container.lastChild);

  // Create content 
  const content = document.createElement("div");
  content.classList.add("content");
  container.appendChild(content);

  // Build player 1 scoreboard
  const player1Info = document.createElement("div");
  player1Info.classList.add("player-info");
  player1Info.innerText = player1.getPlayerName();
  content.appendChild(player1Info);

  const player1Score = document.createElement("div");
  player1Score.classList.add("player-info");
  player1Score.innerText = player1.getPlayerScore();
  player1Info.appendChild(player1Score);

  // Build board back
  const grid = document.createElement("div");
  grid.classList.add("grid-container");
  content.appendChild(grid);

  //Generate the cells of the grid 
  for (let i = 0; i < 3; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("grid-row");

    for (let j = 0; j < 3; j++) {
      const newCell = document.createElement("div");
      newCell.classList.add("grid-cell");
      newCell.addEventListener("click", () => {
        let currentPlayer = players.getCurrentPlayer();
        
        const placementResult = gameBoard.placeMark(currentPlayer.getPlayerSymbol(), i, j);
        
        if (placementResult)  {
          newCell.innerText = players.getCurrentPlayer().getPlayerSymbol();

          if (gameBoard.checkForWinner()) {
            currentPlayer.updatePlayerScore();
            generateGameOver();
          } else if (gameBoard.getNumTurns() === 8) {
            generateGameOver();
          }
          
          players.swapPlayers();
          gameBoard.increaseNumTurns();
        }
      });
      newRow.appendChild(newCell);
    }

    grid.appendChild(newRow);
  }

  // Build player 2 scoreboard
  const player2Info = document.createElement("div");
  player2Info.classList.add("player-info");
  player2Info.innerText = player2.getPlayerName();
  content.appendChild(player2Info);

  const player2Score = document.createElement("div");
  player2Score.classList.add("player-info");
  player2Score.innerText = player2.getPlayerScore();
  player2Info.appendChild(player2Score);


  function generateGameOver() {
    const gameOver = document.createElement("div");
    gameOver.classList.add("game-over");
    grid.appendChild(gameOver);

    const replayButton = document.createElement("button");
    replayButton.innerText = "PLAY AGAIN"
    replayButton.classList.add("replay-button");
    replayButton.addEventListener("click", () => {
      generateHTMLGrid(players, board());
    })
    gameOver.appendChild(replayButton);
  }
}

// IIFE new game function
// generates a board and players
// HTML board generation placed in here to get access to the board and player functions
(function newGame(){
  const gameBoard = board();
  const players = generatePlayers();
  generateHTMLGrid(players, gameBoard);
})();