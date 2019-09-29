import help from './commands/help';
import {
    pwd,
    ls,
    cd,
    checkFile
} from './commands/fs';
import read from './commands/read';
import scan from './commands/scan';
import ssh from './commands/ssh';
import sshAdd from './commands/ssh-add';

import random from './random';

const ERROR_COMMAND_NOT_FOUND = (command) => `-bash: ${command}: command not found. Команда help для помощи`;

const now = (m) => Promise.resolve(m);
const delay = (m, d) => new Promise((resolve) => setTimeout(() => resolve(m), d));

export default class Command {
    exec(input, history) {
        const [command, ...args] = input.replace(/\s+/g, ' ').trim().split(' ');

        switch (command.toLowerCase()) {
            case 'help':
                return now(help(...args));
            case 'ls':
                return now(ls());
            case 'pwd':
                return now(pwd());
            case 'cd':
                return cd(...args);
            case 'scan':
                return delay(scan(), random(500, 2000));
            case 'ssh':
                if (!args.length) return now('-bash: ssh: ip is required');

                return delay(ssh(...args), random(700, 2100));
            case 'ssh-add':
                if (!args.length) {
                    return now();
                } else {
                    const check = checkFile(...args);

                    if (check) {
                        return now(check);
                    } else {
                        return now(sshAdd(...args));
                    }
                }
            case 'read':
                if (!args.length) {
                    return now();
                } else {
                    const check = checkFile(...args);

                    if (check) {
                        return now(check);
                    } else {
                        return delay(read(args[0], history), random(100, 200));
                    }
                }
            default:
                return now(ERROR_COMMAND_NOT_FOUND(command));
        }
    }
}