import { spawn } from 'child_process';
import { sleep, Time } from 'koishi-core';

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

// 在node_modules/koishi-plugin-mysql/lib/index.js的第480添加了如下代码
// const count = (await this.query(`SELECT COUNT(*) FROM ??`, ["user"]))[0]['COUNT(*)']
// Object.assign(user, {id: count.toString()})
