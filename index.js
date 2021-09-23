const { buildSetup } = require("./src/setup");
const { startExecution } = require("./src/index");

(() => {
  buildSetup();
  startExecution();
})();
