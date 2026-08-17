const { exec } = require("child_process");
let config = require("../src/config");
let host = require("../../../framework/src/config")
  .baseURL.replace("http://", "")
  .replace("https://", "");

console.log("No Backend Tests Configured!");
process.exit(0);
