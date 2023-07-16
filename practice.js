"use strict";
var msg = "Hello Typescript";
msg.toLowerCase;
function greet(person, date) {
    console.log("Hello ".concat(person, ", today is ").concat(date, "!"));
}
greet("Brendan", Date.now());
