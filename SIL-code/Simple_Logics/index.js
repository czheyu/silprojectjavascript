/* notes

git commit -m ‹commit message>
git push origin master

for input

npm install prompt-sync

*/
const prompt = require('prompt-sync')();

const name = prompt('What is your name?');
console.log(`Hey there ${name}`);
