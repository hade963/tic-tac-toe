let board = [];
chooseOpponent();
let opponent;

let player1 = player('player1','O');
let player2 = player('player2','X');
  // Game board object
  const gameboard = (function () {
  const container = document.querySelector('#gameboard');
  function fillGameBoard () { 
    container.innerHTML = '';
    for(let i=0;i<9;i++) {
      let li = document.createElement('li');
      board[i] = i;
      li.dataset.index = i;
      container.appendChild(li);
    }
  }

  function mark(number,player) {
    let li = document.querySelector(`li[data-index="${number}"]`);
    if(li.textContent === '' ) {
      board[number] = player.getChar();
      li.textContent = player.getChar();
      return true;
    }
    return false;
  }
  return {fillGameBoard,mark};
})();
// player Object
function player(name,char,wins=0) { 

  function getChar() {
    return char;
  }
  function getName () { 
    return name;
  }
  return {
    getChar,
    getName,
    wins
  };
}
// End player object

/* Start computer player */
let computer  = (function (name,char) { 
  let wins = 0;
  char = 'X';
  name = 'computer';
  function getName() {
    return name;
  }
  function getChar() { 
    return char;
  }
  return {getChar,wins,getEmptyIndexes,getName};
})();
/* End computer player */
// game object 
const game = (function () {
  let counter = -1;
  function checkWinner(board,player) {
      if (( board[0] === player.getChar() && board[1] === player.getChar() && board[2]===player.getChar()) ||
          ( board[3] === player.getChar() && board[4] === player.getChar() && board[5]===player.getChar()) || 
          ( board[6] === player.getChar() && board[7] === player.getChar() && board[8]===player.getChar()) ||
          ( board[0] === player.getChar() && board[3] === player.getChar() && board[6]===player.getChar()) ||
          ( board[1] === player.getChar() && board[4] === player.getChar() && board[7]===player.getChar()) ||
          ( board[2] === player.getChar() && board[5] === player.getChar() && board[8]===player.getChar()) ||
          ( board[0] === player.getChar() && board[4] === player.getChar() && board[8]===player.getChar()) ||
          ( board[2] === player.getChar() && board[4] === player.getChar() && board[6]===player.getChar())) { 
      return true;
    } else  
      return false;
  }
  function playWithComputer(index) {
    if(gameboard.mark(index,player1)) { 
      if(endGame(player1,computer))
        return;
      console.log(minmax(board,computer));
      gameboard.mark(minmax(board,computer).index,computer);
      if(endGame(player1,computer))
        return;
      }
  }
  function play(index) {
    if(counter % 2 === 0) {
      if(gameboard.mark(index,player1)) { 
        counter++;
        endGame();
      }
    }
    else if(counter % 2 !== 0 ) { 
      if(gameboard.mark(index,player2)) { 
        counter++;
        endGame();
      }
    }
    
  }
    function endGame(playerA,playerB) { 
      let empty = getEmptyIndexes(board);
      let winner = checkWinner(board,playerA)  ? 1 : checkWinner(board,playerB) ? -1 : empty.length === 0 ? 0 : null;  
      console.log(winner);
      if(winner === 0 || winner === -1 || winner === 1) {
        resetCounter(); 
        let template = document.querySelector('template').content;
        let container = template.querySelector('.gameOver').cloneNode(true);
        let h2 = container.querySelector('h2');
        h2.textContent = 'Game Over';
        let h3 = container.querySelector('h3');
        
        incrementScore(winner);
        h3.textContent =  winner === -1 ? `${playerB.getName()} has beaten ${playerA.getName()}`:
        winner === 1 ? `${playerA.getName()} has beaten ${playerB.getName()}` :
        'Tie State';
        document.body.className = 'hide';
        document.body.appendChild(container);
        return true;
      } 
      return false;
  }

  function incrementScore(result) { 
    let player1result = document.querySelector(".result p.player1");
    let player2result = document.querySelector(".result  p.player2");
    if(result === 1)  
      player2.wins++;
    
    else if(result === -1)
      player1.wins++;
    player1result.textContent = `${player1.wins}`;
    player2result.textContent = `${player2.wins}`;
  }

  function resetCounter() { 
    counter = -1;
  }

  return {playWithComputer,play,resetCounter,checkWinner};
})();

// Start Event Listeners
gameboard.fillGameBoard();  

document.addEventListener('click',function(e) { 
  if(e.target.dataset.index !== undefined ) {
    let index = e.target.dataset.index;
    //choose which player to play with depent on player choice
    if(opponent) { 
      game.playWithComputer(index);
    }
    else {
      game.play(index);
    }
  }
});

document.addEventListener('click',function(e) { 
  if(e.target.className === 'playAgain') { 
    document.body.setAttribute('class','');
    board = [];
    game.resetCounter();
    e.target.parentNode.remove();
    gameboard.fillGameBoard();
  }
});

const restart = document.querySelector('.restart');
restart.addEventListener('click', function() {
  gameboard.fillGameBoard();
  board = [];
  game.resetCounter();
});

// Choose your opponent 
function chooseOpponent() {
  const template = document.querySelector('template.menu-template').content;
  const container = template.cloneNode(true);
  const input = container.querySelector('form input');
  isChecked = input.checked;
  document.body.appendChild(container);
  document.body.className = 'hide';
} 
document.addEventListener('submit',function(e) {
  if(e.target.className = "start") { 
    e.preventDefault();
    document.body.setAttribute('class','');
    opponent = e.target.querySelector('input').checked;
    e.target.parentNode.remove();
  }
},);
// ai logic 
function getEmptyIndexes(b) { 
  return b.filter((e) => e !== 'X' && e !== 'O');
}

function minmax(currBdSt, currMark) {
  const availCellsIndexes = getEmptyIndexes (currBdSt);
  
  if (game.checkWinner(currBdSt, player1)) {
      return {score: -1};
  } else if (game.checkWinner(currBdSt, computer)) {
      return {score: 1};
  } else if (availCellsIndexes.length === 0) {
      return {score: 0};
  }
  
  const allTestPlayInfos = [];
  
  for (let i = 0; i < availCellsIndexes.length; i++) {
      const currentTestPlayInfo = {};
      
      currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];
      
      currBdSt[availCellsIndexes[i]] = currMark.getChar();
      
      if (currMark.getChar() === computer.getChar()) {
          const result = minmax(currBdSt, player1);
          
          currentTestPlayInfo.score = result.score;
      } else {
          const result = minmax(currBdSt, computer);
          
          currentTestPlayInfo.score = result.score;
      }
      
      currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;
      
      allTestPlayInfos.push(currentTestPlayInfo);
  }
  
  let bestTestPlay = null;
  
  if (currMark.getChar() === computer.getChar()) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score > bestScore) {
              bestScore = allTestPlayInfos[i].score;
              bestTestPlay = i;
          }
      }
  } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score < bestScore) {
              bestScore = allTestPlayInfos[i].score;
              bestTestPlay = i;
          }
      }
  }
  return allTestPlayInfos[bestTestPlay];
}