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

  return ({ getCurrentPlayer, swapPlayers })
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

(function newGame(){
  const gameBoard = board();
  const players = generatePlayers();
  let gameOver = false;

  while (!gameOver) {
    let currentPlayer = players.getCurrentPlayer();

    const row = prompt(`It is player ${currentPlayer.getPlayerName()}'s turn! What row would you like to place your mark?`);
    const col = prompt(`It is player ${currentPlayer.getPlayerName()}'s turn! What column would you like to place your mark?`);

    const placementResult = gameBoard.placeMark(currentPlayer.getPlayerSymbol(), row, col);

    if (placementResult)  {
      if (gameBoard.checkForWinner()) {
        gameOver = true;
        alert("Winner!");
      } else if (gameBoard.getNumTurns === 9) {
        alert("Draw!");
      }
  
      players.swapPlayers();
      gameBoard.increaseNumTurns();
    } else {
      alert("Invalid cell");
    }
  }
})();