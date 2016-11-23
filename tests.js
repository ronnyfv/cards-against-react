require("source-map-support").install();

const chalk = require("chalk");
const Jasmine = require("jasmine");

const tests = new Jasmine();
tests.loadConfig({
  spec_dir: './build/',
  spec_files: ['**/__tests/*.js']
});

tests.configureDefaultReporter({
  showColor: true,
  isVerbose: true
});

tests.onComplete(function (passed) {
  if (passed) {
    chalk.bgGreen('All specs have passed1');
    console.log('All specs have passed1');
  }
  else {
    chalk.bgRed('At least one spec has failed1');
    console.log('At least one spec has failed1');
  }
});

tests.execute();