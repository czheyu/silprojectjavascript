const prompt = require("prompt-sync")();

//function to reset the game to play
function initiallize(wordarray) {
  lifes = 6;
  guessedwords =[];
  guess = "";
  won = false;
  choosenword = chooseAWord(wordarray);
  choosenlength = choosenword.length;
  display(choosenword, choosenlength);
}

//recursive function(calls itself while +1 the check index till its out of range(==to .length))checking if won, returns true if won else false
function checkIfWon(word, wordlength, index) {
  if (index == wordlength) {
    return true;
  } else {
    if (guessedwords.includes(word[index]) == false) {
      //if any letter is not guessed, the game is not won
      return false;
    }
    return checkIfWon(word, wordlength, index + 1);
  }
}

//function to choose a word from the array of words
function chooseAWord(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function display(word, wordlength) {
  console.log(`Characters guessed ${guessedwords}`);
  tobedisplayedtext = "";
  for (let i = 0; i < wordlength; i++) {
    if (guessedwords.includes(word[i])) {
      tobedisplayedtext += word[i];
    } else {
      if (word[i] == " ") {
        tobedisplayedtext += "space";
      } else {
        tobedisplayedtext += "_";
      }
    }
  }
  console.log(`Word: ${tobedisplayedtext}\nLifes: ${lifes}`);
}

function takeAGuess(word, wordlength) {
  guess = prompt("Guess a letter: ");
  if (guess.length == 1 && guess != " ") {
    if (!guessedwords.includes(guess)) {
      //continue
      console.log(`you guessed ${guess}`);
      guessedwords.push(guess);
      if (!word.includes(guess)){
        lifes -= 1
        if(lifes<1){
          console.log("You ran out of lifes");
        }
      }
      if (checkIfWon(word, wordlength, 0)) {
        won = true;
        return true
      }
      display(word, wordlength);
    } else {
      console.log(`${guess} was already guessed`);
    }
  } else {
    console.log("Please enter a single letter");
  }

}

//main loop
function play(wordarray) {
  initiallize(wordarray);
  while (lifes>0) {
    if (takeAGuess(choosenword, choosenlength)){
      break;
    }
  }
  if(won){
  //when won
  console.log(`You won! with ${lifes} life(s) left`);
  }
  if (prompt("Play again?(y/n): \n") == "y") {
    //calls itself again
    play(wordarray);
  }
}

//main entrypoint
function main() {
  const arrayofwords = require("./words.json");
  
  //initializing variables
  let choosenword;
  let choosenlength;
  let guessedwords;
  let guess;
  let won;
  let tobedisplayedtext;
  let lifes;
  play(arrayofwords);
}

//calling main
main();
