// Test fixture: logs to stdout/stderr then exits
// Usage: node log.cjs <exitCode> <count> [stdout] [stderr]
// ES5 compatible for Node 0.8+

var exit = require('../../dist/cjs/index.js');

var exitCode = parseInt(process.argv[2], 10) || 0;
var count = parseInt(process.argv[3], 10) || 10;
var modes = process.argv.slice(4);

function writeStdout(message) {
  if (modes.indexOf('stdout') === -1) return;
  process.stdout.write('stdout ' + message + '\n');
}

function writeStderr(message) {
  if (modes.indexOf('stderr') === -1) return;
  process.stderr.write('stderr ' + message + '\n');
}

for (var i = 0; i < count; i++) {
  writeStdout(i);
  writeStderr(i);
}

exit(exitCode);

// These should NEVER be output - exit() should prevent further execution
writeStdout('fail');
writeStderr('fail');
