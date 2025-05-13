const health = require('./utils/health.js');

process.stdin.pipe(process.stdout);

// Set up error detection
health.detectBuildErrors(process.stdin, process.stdin, [
  /error/i,
  /exception/i,
  /failed to compile/i
]).then(error => {
  if (error) {
    console.error('Build error detected:', error);
    process.exit(1);
  }
});