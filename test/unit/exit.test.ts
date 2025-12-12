// remove NODE_OPTIONS to not interfere with tests
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import { exec } from 'child_process';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, '..', 'fixtures');

function run(command: string, callback: (code: number, stdout: string) => void): void {
  exec(command, { cwd: fixturesPath }, (error, stdout) => {
    const code = error ? (error as NodeJS.ErrnoException & { code: number }).code : 0;
    // Normalize line endings for cross-platform compatibility
    const normalizedStdout = stdout.replace(/\r?\n/g, '\n');
    callback(code, normalizedStdout);
  });
}

function generateExpected(count: number, modes: string[]): string {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    if (modes.indexOf('stdout') !== -1) lines.push(`stdout ${i}`);
    if (modes.indexOf('stderr') !== -1) lines.push(`stderr ${i}`);
  }
  return lines.join('\n') + (lines.length > 0 ? '\n' : '');
}

describe('exit', () => {
  describe('exit codes', () => {
    const codes = [0, 1, 123];

    codes.forEach((expectedCode) => {
      it(`should exit with code ${expectedCode}`, (done) => {
        run(`node log.cjs ${expectedCode} 10 stdout stderr`, (code) => {
          assert.equal(code, expectedCode);
          done();
        });
      });
    });
  });

  describe('output draining', () => {
    const counts = [10, 100, 1000];
    const outputModes = [['stdout', 'stderr'], ['stdout'], ['stderr']];

    counts.forEach((count) => {
      outputModes.forEach((modes) => {
        const modesStr = modes.join(' ');
        it(`should drain ${count} lines to ${modesStr}`, (done) => {
          run(`node log.cjs 0 ${count} ${modesStr} 2>&1`, (_code, stdout) => {
            const expected = generateExpected(count, modes);
            // Check length matches (output order may vary on Windows)
            assert.equal(stdout.length, expected.length, 'output length should match');
            // Verify "fail" never appears (code after exit should not run)
            assert.equal(stdout.indexOf('fail'), -1, 'should not output after exit');
            done();
          });
        });
      });
    });
  });

  describe('prevents output after exit', () => {
    it('should not output anything after exit() is called', (done) => {
      run('node log.cjs 0 5 stdout stderr 2>&1', (_code, stdout) => {
        assert.equal(stdout.indexOf('fail'), -1, 'should not contain "fail"');
        done();
      });
    });
  });
});
