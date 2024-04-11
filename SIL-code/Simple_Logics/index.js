/* notes

git commit -m ‹commit message>
git push origin master

for input

npm install prompt-sync

*/

const prompt = require("prompt-sync")();

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
let numberofquestions = 10;
let response;
let firstnumber;
let secondnumber;
let result;
let correctanswer;
let score = 0;
let start;
let sign;
let possiblesigns = ["+", "-", "*"];
for (let i = 0; i < numberofquestions; i++) {
  firstnumber = getRandomIntInclusive(1, 30);
  secondnumber = getRandomIntInclusive(1, 30);
  sign = possiblesigns[getRandomIntInclusive(0, 2)];
  if (sign == "+") {
    result = String(firstnumber + secondnumber);
  } else if (sign == "-") {
    result = String(firstnumber - secondnumber);
  } else if (sign == "*") {
    result = String(firstnumber * secondnumber);
  }
  correctanswer = false;

  start = new Date().getTime();
  while (correctanswer == false) {
    response = prompt(`What is ${firstnumber} ${sign} ${secondnumber}?: `);

    if (response == result) {
      console.log("Yes you got it correct");
      correctanswer = true;
      score += 1000000 / (new Date().getTime() - start);
    } else {
      console.log("No you got it wrong");
    }
  }
}
console.log(`Your score is ${Math.floor(score)}\n`);
