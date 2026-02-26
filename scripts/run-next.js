#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

function sanitizeNodeOptions(raw) {
  if (!raw) return '';

  // Remove:
  // 1) --localstorage-file=/path
  // 2) --localstorage-file /path
  const stripped = raw.replace(
    /(^|\s)--localstorage-file(?:=\S+|\s+\S+)?(?=\s|$)/g,
    ' '
  );

  return stripped.replace(/\s+/g, ' ').trim();
}

const nextArgs = process.argv.slice(2);
if (nextArgs.length === 0) {
  console.error('Usage: node scripts/run-next.js <next-command> [...args]');
  process.exit(1);
}

const env = { ...process.env };
env.NODE_OPTIONS = sanitizeNodeOptions(process.env.NODE_OPTIONS || '');
const preloadPath = path.join(__dirname, 'polyfill-localstorage.js');

const child = spawn(
  process.execPath,
  ['-r', preloadPath, require.resolve('next/dist/bin/next'), ...nextArgs],
  {
    stdio: 'inherit',
    env,
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
