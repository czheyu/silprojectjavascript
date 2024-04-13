const prompt = require("prompt-sync")();

const arrayofwords = ["hello","cat","dog","mouse","house","car","computer","phone","chair","table","bed","window","door","book","pen"]
let choosenword;
let choosenlength;
let guessedwords = [];
let guess = "";
let won = false;
function checkIfWon(){
  pass
}
function chooseAWord(){
  return arrayofwords[Math.floor(Math.random() * arrayofwords.length)];
}

choosenword = chooseAWord();
choosenlength = chooseAWord.length;

while (won == false){
  guess = prompt("Guess a letter: ");
  if (guess.length == 1 ){
    console.log("Correct")
  } else {
    console.log("Incorrect")
  }
}