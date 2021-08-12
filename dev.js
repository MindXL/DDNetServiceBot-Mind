const { spawn } = require('child_process');
const { sleep, Time } = require('koishi-core');

(async () => {
    spawn('yarn', ['tsc', '-w']);

    await sleep(5 * Time.second);

    spawn('yarn', ['koishi', 'start', './dist/koishi.config.js'], {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
    // spawn('node', ['./dist/index.js'], {
    //     stdio: [process.stdin, process.stdout, process.stderr],
    // });
})();
