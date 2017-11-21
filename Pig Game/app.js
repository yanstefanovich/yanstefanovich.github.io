/*
NOTES:

//It is not a good practice to manipulate CSS with JS
//Create a CSS class with desired effect and add/remove it as necessary

//FETCHING AN ELEMENT FORM THE DOM
//getElementById executes faster than querySelector

//MANIPULATING CLASSES ON ELEMENT
//toggle command removes class if it exists and adds if it doesn't
//it essentially jumps between these two commands:
//document.querySelector('.class').classList.remove('active');
//document.querySelector('.class').classList.add('active');

//SETTING VALUE
//textContent can only manipulate text.
//document.querySelector('#current-' + activePlayer).textContent = diceRoll;

//thus below would output <em>2</em> instead of italicized 2
//document.querySelector('#current-' + activePlayer).textContent = '<em>' + diceRoll + '</em>';

//innerHTML can manipulate the html doc and thus we get an italicized 2
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + diceRoll + '</em>';

//READING A VALUE
//we can also read a value from the doc in the following way

var x = document.querySelector('#score-0').textContent;
console.log(x);

//We can get a value for an input field in the following way
var y = document.getElementById('input-field').value;
console.log(y);

//TERNARY OPERATOR



//EVENTS
//Events are sent when something happens on the page
//like clicking, scrolling, resizing, pressing a key and more!
//Before events can be handled by the event listener the JS must execute all of
//its execution contexts and then the event is given its own execution
//context when it is being handled

//Event listeners are function that performs an action based
//on a certain event. It waits for an event to hapen and acts.

//addEventListener takes 2 arguments: the event, the function to be executed
//the function in the event listener is reffered to as a callback function
//because it is called for us

document.querySelector('.btn-roll').addEventListener('click', btn);

function btn(){
  //do stuff
  console.log('Action Performed');
}

//We can also write out a function for the event listener only, it is known as
//an anonymous function

document.querySelector('.btn-roll').addEventListener('click', function() {
  //do stuff
  console.log('Action Performed');
});

GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result
get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's
the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added
to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

3 Challenges
Modify the game for the following rules

DONE 1. A player looses their total score when they roll two 6's in a row and lose
their turn.

DONE 2.Add an input field to the HTML where players can set the winning score, 100
is no longer the default. (HINT: use .value)

DONE 3. Add another dice to the game, so that there are two dice. the player looses
their score when one of them is a 1.
*/

//Initiate Global Variables
var scores, roundScore, activePlayer, gameActive, scoreToWin;
var prevRoll = 0;

//Initiate the game
reset();

//Game initiation function
function reset(){
  //read the value from the input for score to win
  scoreToWin = document.getElementById('scoreToWin').value;
  //If score to win is an actual value then reset the game
  if (scoreToWin && scoreToWin > 0) {
    //reset all the score values to zero
    scores = [0,0];
    roundScore = 0;
    //reset the game state to active
    gameActive = true;

    //randomly select the starting player
    //Player 1 >= 0.5
    //Player 2 < 0.5
    if(Math.random() < 0.5){
      activePlayer = 0;
    } else {
      activePlayer = 1;
    }

    //Notify Players of Winning Condition
    document.getElementById('notify').textContent = scoreToWin;
    //Hide dice at the beginning of the game
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.dice-2').style.display = 'none';

    //Reset the display for each player's score to zero
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    //Reset the display for each player's the round score to zero
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    //Reset the css styles on Player 1
    document.getElementById('name-0').textContent = 'Player 1';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');

    //Reset the css styles on Player 2
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');

    //Apply active style to the randomly selected player (taking first turn)
    document.querySelector('.player-'+activePlayer+'-panel').classList.add('active');
  }
}

//Turn ending function
function nextPlayer() {
  //Current Player has their round score reset to zero
  roundScore = 0;
  //reset the previous roll for next player
  prevRoll = 0;
  //Update the display with current round score
  document.getElementById('current-' + activePlayer).textContent = roundScore;
  //Current Player loses turn and the active effect
  document.querySelector('.player-'+activePlayer+'-panel').classList.toggle('active');

  //Next Player become current player
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  //gains the active effect
  document.querySelector('.player-'+activePlayer+'-panel').classList.toggle('active');
  //Hide the dice for next player until roll
  setTimeout(function(){
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.dice-2').style.display = 'none';
  },250);
}

//NEW GAME Action Event Listener
//Calls reset game function
document.querySelector('.btn-new').addEventListener('click',reset);

//ROLL BUTTON Action event listener
document.querySelector('.btn-roll').addEventListener('click', function() {
  //Roll disabled if game has ended
  if (gameActive) {
    //DICE ROLLING
    //Get a Random Roll Number
    var roll_1 = Math.floor(Math.random()*6) + 1;
    var roll_2 = Math.floor(Math.random()*6) + 1;

    //Display the dice roll
    var diceDOM_1, diceDOM_2;
     //assign each dice to a variable
    diceDOM_1 = document.querySelector('.dice-1');
    diceDOM_2 = document.querySelector('.dice-2');
    //display the dice
    diceDOM_1.style.display = 'block';
    diceDOM_2.style.display = 'block';
    //display the appropreaite number rolled
    diceDOM_1.src = 'dice-' + roll_1 + '.png';
    diceDOM_2.src = 'dice-' + roll_2 + '.png';

    //SCORING SYSTEM
    //If the previous roll and this roll are both 6
    //OR
    //If a double 6 is rolled
    if ((roll_1 === 6 && roll_2 === 6) || (prevRoll === 6 && roll_1 === 6)) {
      //Reset previous roll for next player
      prevRoll = 0;
      //Clear Total Score
      scores[activePlayer] = 0;
      //Update the total score on the player's display
      document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];
      //End turn
      nextPlayer();
    }
    //If the roll on either dice in not 1
    else if (roll_1 !== 1 && roll_2 !== 1) {
      //Store the current roll for next round as a 6 if either dice was a 6
      if (roll_1 === 6 || roll_2 === 6) {
        prevRoll = 6;
      } else{
        prevRoll = roll_1;
      }
      //Add roll to round score
      roundScore += roll_1 + roll_2;
      //Update the round score on the display
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
    }
    //If the roll is 1
    else {
      //Reset the previous roll for next player
      prevRoll = 0;
      //End turn
      nextPlayer();
    }
  }
});

//HOLD BUTTON Event Listener
document.querySelector('.btn-hold').addEventListener('click',function() {
  //Hold doesn't work if current score is zero
  //Hold doesn't work if game has ended
  if (gameActive && roundScore !== 0) {
    //Add round score to player's total score
    scores[activePlayer] += roundScore;
    //Update the score on the UI
    document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];

    //Check if current player won the game
    if (scores[activePlayer] >= scoreToWin) {
      //Set the Player name to Winner
      document.getElementById('name-'+activePlayer).textContent = 'WINNER!';
      //Hide the dice
      document.querySelector('.dice-1').style.display = 'none';
      document.querySelector('.dice-2').style.display = 'none';
      //Add winner effect
      document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
      //Remove active player effect
      document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
      //End the game by setting game status to false
      gameActive = false;

    } else {
      //End Turn
      nextPlayer();
    }
  }
});
