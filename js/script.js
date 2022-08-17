
  let board = [];
  chooseOpponent();
  let opponent;
  // Game board object
  const gameboard = (function () {
  const container = document.querySelector('#gameboard');
  function fillGameBoard () { 
    container.innerHTML = '';
    for(let i=0;i<9;i++) {
      let li = document.createElement('li');
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
function player(name,char,color='black',wins=0) { 

  function getChar() {
    return char;
  }
  function getName () { 
    return name;
  }
  return {
    getChar,
    getName,
    color,
    wins
  };
}
// End player object
/* Start computer player */
let computer  = (function (name,char) { 
  let wins =0;
  char = 'O';
  function getName() {
    return name;
  }
  function getChar() { 
    return char;
  }
  function playTurn() { 
    let random = Math.floor(Math.random() *(8+1));
    return random;
  }
  return {getName,getChar,playTurn,wins}; 
})();
/* End computer player */
let player1 = player('player1','X',"rgb(42, 26, 189)");
let player2 = player('player2','O',"rgb(235, 152, 0)");
// game object 
const game = (function () {
  let counter = -1;
  function checkWinner() {
      if (( board[0] === 'X' && board[1] === 'X' && board[2]==='X') ||
          ( board[3] === 'X' && board[4] === 'X' && board[5]==='X') || 
          ( board[6] === 'X' && board[7] === 'X' && board[8]==='X') ||
          ( board[0] === 'X' && board[3] === 'X' && board[6]==='X') ||
          ( board[1] === 'X' && board[4] === 'X' && board[7]==='X') ||
          ( board[2] === 'X' && board[5] === 'X' && board[8]==='X') ||
          ( board[0] === 'X' && board[4] === 'X' && board[8]==='X') ||
          ( board[2] === 'X' && board[4] === 'X' && board[6]==='X')) { 
      return 1;
    }

    else  if((board[0] === 'O' && board[1] === 'O' && board[2]==='O') ||
            ( board[3] === 'O' && board[4] === 'O' && board[5]==='O') || 
            ( board[6] === 'O' && board[7] === 'O' && board[8]==='O') ||
            ( board[0] === 'O' && board[3] === 'O' && board[6]==='O') ||
            ( board[1] === 'O' && board[4] === 'O' && board[7]==='O') ||
            ( board[2] === 'O' && board[5] === 'O' && board[8]==='O') ||
            ( board[0] === 'O' && board[4] === 'O' && board[8]==='O') ||
            ( board[2] === 'O' && board[4] === 'O' && board[6]==='O')) { 
      return 2;
    }

    else if(counter >= 8) { 
      return 0;
    } 
    return -1;
  }
  function playWithComputer(index) {
    
          if(gameboard.mark(index,player1)) {
            counter++;
            if(endGame()) 
              return;
              while(true) { 
                if(gameboard.mark(computer.playTurn(),computer)) { 
                  counter++;
                  endGame();
                  break;
                }
          }
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
    function endGame() { 
      let winner = checkWinner();
      console.log(winner);
      if(winner >= 0) {
        resetCounter(); 
        let template = document.querySelector('template').content;
        let container = template.querySelector('.gameOver').cloneNode(true);
        
        let h2 = container.querySelector('h2');
        h2.textContent = 'Game Over';
        let h3 = container.querySelector('h3');
        incrementScore(winner);
        h3.textContent =  winner === 0 ? "Tie State" :
        winner === 1 ? `${player1.getName()} has beaten ${player2.getName()}` :
        `${player2.getName()} has beaten ${player1.getName()}`;
        document.body.className = 'hide';
        container.dataset.copy = 'true';
        document.body.appendChild(container);
        return 1;
      } 
      return;
  }
  function incrementScore(result) { 
    let player1result = document.querySelector(".result p.player1");
    let player2result = document.querySelector(".result  p.player2");
    if(result === 2) { 
      player2.wins++;
    }
    else if(result === 1)
    player1.wins++;``
    player1result.textContent = `${player1.wins}`;
    player2result.textContent = `${player2.wins}`;
  }
  function resetCounter() { 
    counter = -1;
  }
  return {playWithComputer,play,resetCounter};
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