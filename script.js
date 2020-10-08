const container = document.querySelector("#container")
const table = document.createElement("table")
const status = document.createElement("p")
const restartButton = document.createElement("input")

const setupTable = () => {
    let pos = 0
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("tr")
        for (let j = 0; j < 3; j++) {
            let data = document.createElement("td")
            data.dataset.pos = pos

            data.addEventListener("click", () => {
                makePlay(i,j);
            })

            row.appendChild(data)
            pos++
        }
        table.appendChild(row)
    }

    status.innerText = "O's turn!"
    status.id = "status"

    restartButton.type = "button"
    restartButton.value = "Restart"
    restartButton.addEventListener("click", restartGame)
    restartButton.id = "restart"

    container.appendChild(table)
    container.appendChild(status)
    container.appendChild(restartButton)
}

const restartGame = () => {
  gameBoard.restartBoard();
  renderGameState(gameBoard.getGameState());
  let playState = gameBoard.currentPlayState();
  status.innerText = `${playState.player}'s turn`;
};

const makePlay = (x,y) => {
  let playState = gameBoard.currentPlayState();
  if(playState.winner){
    status.innerText = `${playState.winner} has won the game`;
    return;
  }
  gameBoard.playAtPosition(x,y);
  renderGameState(gameBoard.getGameState());
  let newState = gameBoard.currentPlayState();
  if(newState.winner){
    status.innerText = `${newState.winner} has won the game`;
    return;
  }
  status.innerText = `${newState.player}'s turn`;

}

const renderGameState = (gameState) => {
  for (var i = 0, row; row = table.rows[i]; i++) {
   //iterate through rows
   //rows would be accessed using the "row" variable assigned in the for loop
    for (var j = 0, col; col = row.cells[j]; j++) {
      //iterate through columns
      //columns would be accessed using the "col" variable assigned in the for loop
      col.innerText = `${gameState[i][j] || ''}`
    }  
  }
};

const gameBoard = (() => {
  const _gameState = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
  ]
  const _playerX = "X";
  const _playerY = "O";
  let _currentPlayer = _playerY;

  const playAtPosition = (x,y) => {
    _gameState[x][y] = _currentPlayer;
    _switchCurrentPlayer();
  };

  const currentPlayState = () => {
    return {
      winner:_isThereSomeSuccess(),
      player:_currentPlayer
      };
  };

  const _isThereSomeSuccess = () => {
    let hor = _winnerInHorizontals(_gameState);
    let ver = _winnerInVerticals(_gameState);
    let dia1 = _winnerInMajorDiags(_gameState);
    let dia2 = _winnerInMinorDiags(_gameState);
    return hor || ver || dia1 || dia2 || null;
  };

  const _transpose = m => m[0].map((x,i) => m.map(x => x[i]))

  const _winnerInHorizontals = (_matrix) => {
    if(
      _matrix[0].every ( v=> v == _playerX) ||
      _matrix[1].every ( v=> v == _playerX) ||
      _matrix[2].every ( v=> v == _playerX)
    ) return _playerX;
    else if (
      _matrix[0].every ( v=> v == _playerY) ||
      _matrix[1].every ( v=> v == _playerY) ||
      _matrix[2].every ( v=> v == _playerY)
    ) return _playerY;
    else return null;
  };

  const _winnerInVerticals = (_matrix) => {
    return _winnerInHorizontals(_transpose(_matrix));
  };

  const _winnerInMajorDiags = (_matrix) => {
    let size = _matrix.length;
    let dialElems = [];
    for(let i = 0; i< size; i++){
      dialElems.push(_matrix[i][i]);
    }
    if(dialElems.every( v=> v === _playerX)) return _playerX;
    else if (dialElems.every (v => v === _playerY)) return _playerY;
    else return null;
  }

  const _winnerInMinorDiags = (_matrix) => {
    let size = _matrix.length;
    let dialElems = [];
    let currRow = 0;
    for(let i = size -1; i>=0; i--){
      dialElems.push(_matrix[currRow++][i]);
    }
    if(dialElems.every( v=> v === _playerX)) return _playerX;
    else if (dialElems.every (v => v === _playerY)) return _playerY;
    else return null;
  };

  const getGameState = () => {
    return Object.assign({}, _gameState);
  };

  const _switchCurrentPlayer = () => {
    if(_currentPlayer === _playerX)
      _currentPlayer = _playerY;
    else _currentPlayer = _playerX;
  };

  const restartBoard = () => {
    for(let i =0; i < _gameState.length; i++){
      for(let j=0; j< _gameState[i].length; j++){
        _gameState[i][j]=null;
      }
    }
    _currentPlayer = _playerY;
  };

  return {
    getGameState,
    playAtPosition,
    currentPlayState,
    restartBoard
  }
})();

setupTable();