# Node.js Sil
---


## Goals for Student Initiated Learning (2024)


### Items to be achieved:

- [ ] Learn the *basics* of Node.js
- [ ] Learn the *background and origin* of Node.js
- [ ] Learn the *pros and cons* of Node.js
- [ ] learn *intermediate concepts* of Node.js
- [ ] Create a simple *project*
- [ ] tbd

      
### Helpful resources
overall just helpful:
- [node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [mdndocs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [w3schools](https://www.w3schools.com/jsref/)
- [geeksforgeeks](https://www.geeksforgeeks.org/)

helpful in editing this readme.md:
- [markdownguide](https://www.markdownguide.org/extended-syntax/)


---


# My understanding of Node.js


## What is node.js
According to [Wikipedia](https://en.wikipedia.org/wiki/Node.js)
- Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting.

From what I understand from reading up, Javascript is mostly used in making interactive and dynamic websites. While node.js is a console focused, back-end runtime that lets you run server-side JavaScript outside of a web browser. I think that it is important to differenciate node.js from pure js, as they ["serve different purposes in the web development ecosystem."](https://reintech.io/blog/difference-between-nodejs-and-javascript) 


## Why use node.js
According to [miquido](https://www.miquido.com/blog/why-use-node-js/), node.js is not only scalable, fast, efficient, cross-platform adaptable, high performance and easy to learn. The node.js community is also huge, allowing for many innovative creations, tutorials, blogs, and creative codebases.
Learning node.js can also carry over into many different frameworks and applications. 

---


# Learning the basics


## Logging, Variables, Types, and If Else Logic

One of the most important building blocks of code and programs are *Logging, Variables, Types, and If Else Logic* 
While writing code with these in them may seem easy, i think mastering the use of them efficiently may need some practice.


### Logging

As i have prior experience in [Python](https://www.python.org/), this instantly makes me think of:

```python
print("hi")
```

While javascript(the language of node.js) is a different language, the syntax is similar, unlike lower level languages like C++.
In js(javascript), outputing a value to the console is as simple as calling the `"console.log()"` method:

```javascript
console.log("hi");
```
> important to put the semicolon as it signifies the end of a line for the interpreter


### Variables

Variables is one of the most well-known concepts related to programming, and so did not need a introduction to this.
Variables are even in math, physics and in block coding apps. 
Accessing and changing a variable in js is almost identical to python's syntax but initializing one is something i have to keep in mind.
After doing research and browsing several web pages, i have come to understand what different initializing keywords achieve and what situations are best fitted for them.


What i learnt:

There are 3 keywords used in initializing a variable, `var`, `let`, and `const`.
- `var` creates a *global*, or functional sometimes (important) variable.
- `let` creates a variable that can be changed and accessed in the scope it was initialized in.
- `const` creats a *constant* variable(as suggested by its name) that cannot be changed, only accessed.

A (very)helpful table i found on [www.geeksforgeeks.org](https://www.geeksforgeeks.org/difference-between-var-let-and-const-keywords-in-javascript/) below:

| var      | let | const     |
| :---        |    :----:   |          ---: |
| The scope of a var variable is functional or global scope.|	The scope of a let variable is block scope.|	The scope of a const variable is block scope.   |
|It can be updated and re-declared in the same scope.|	It can be updated but cannot be re-declared in the same scope.|	It can neither be updated or re-declared in any scope.|
|It can be declared without initialization.|	It can be declared without initialization.|	It cannot be declared without initialization.|
|It can be accessed without initialization as its default value is “undefined”.|	It cannot be accessed without initialization otherwise it will give ‘referenceError’.|	It cannot be accessed without initialization, as it cannot be declared without initialization.|
|These variables are hoisted.|	These variables are hoisted but stay in the temporal dead zone until the initialization.|	These variables are hoisted but stays in the temporal dead zone until the initialization.|

from [www.geeksforgeeks.org](https://www.geeksforgeeks.org/difference-between-var-let-and-const-keywords-in-javascript/) too:
> Note: Sometimes, users face problems while working with the var variable as they change its value of it in a particular block. So, users should use the let and const keywords to declare a variable in JavaScript. 

Using this in a real js example:

```javascript
let variableone;
var variabletwo = "two";
const variablethree = ["one","two","three"]; 
```

where the format is 
keyword variablename = value;
or
keyword variablename;
if we decide just to initiate, but not assign.


### Types

A quick google search results in this as the top response:

JavaScript has 8 Datatypes
: String.
: Number.
: Bigint.
: Boolean.
: Undefined.
: Null.
: Symbol.
: Object.

As some of these seem new and weird i have decided to only focus on 3 for now, String, Number and Boolean.


### If Else Logic


## Simple conditional program








