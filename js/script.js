
  let board = [];
  let display ;
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

  function mark(element,player) {
    if(element.textContent === '' ) {
      board[element.dataset.index] = player.getChar();
      element.textContent = player.getChar();
      return true;
    }
    return false;
  }
  return {fillGameBoard,mark};
})();

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
let player1 = player('player1','X',"rgb(42, 26, 189)");
let player2 = player('player2','O',"rgb(235, 152, 0)");

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
  function play(e,player1,player2) {
    
        if(counter % 2 === 0 ) { 
          if(gameboard.mark(e.target,player1)) {
            counter++;
            
            endGame();
          }
        }
        else if(counter % 2 !== 0) {
          if(gameboard.mark(e.target,player2)) {
            counter++;
            endGame();
          }
        }
  }
    function endGame() { 
      let winner = checkWinner();
      if(winner >= 0) {
        counter = -1; 
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
      } 
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
  return {play};
})();
gameboard.fillGameBoard();  
document.addEventListener('click',function(e) { 
  if(e.target.dataset.index !== undefined ) {
    game.play(e,player1,player2);
  }
});
document.addEventListener('click',function(e) { 
  if(e.target.className === 'playAgain') { 
    document.body.setAttribute('class','');
    board = [];
    e.target.parentNode.remove();
    gameboard.fillGameBoard();
  }
});
const restart = document.querySelector('.restart');
restart.addEventListener('click', function() {
  gameboard.fillGameBoard();
  board =[];
});

/* Start computer playing */
let computer  = (function () { 
  
})();
/* End computer playing */