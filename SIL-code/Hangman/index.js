//function to reset the game to play
function initiallize(wordarray) {
  guessedwords = [];
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
  return array[Math.floor(Math.random() * arrayofwords.length)];
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
  console.log(`Word: ${tobedisplayedtext}`);
}

function takeAGuess(word, wordlength) {
  guess = prompt("Guess a letter: ");
  if (guess.length == 1 && guess != " ") {
    if (!guessedwords.includes(guess)) {
      //continue
      console.log(`you guessed ${guess}`);
      guessedwords.push(guess);
      if (checkIfWon(word, wordlength, 0)) {
        won = true;
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
  while (!won) {
    takeAGuess(choosenword, choosenlength);
  }
  //when won
  console.log("You won!");
  if (prompt("Play again?(y/n): \n") == "y") {
    //calls itself again
    play(wordarray);
  }
}

//main entrypoint
function main(wordarray) {
  const prompt = require("prompt-sync")();

  const arrayofwords = [
    "hello",
    "cat",
    "dog",
    "mouse",
    "house",
    "car",
    "computer",
    "phone",
    "chair",
    "table",
    "bed",
    "window",
    "door",
    "book",
    "pen",
  ];
  //initializing variables
  let choosenword;
  let choosenlength;
  let guessedwords;
  let guess;
  let won;
  let tobedisplayedtext;
  play(wordarray);
}

//calling main
main(arrayofwords);
