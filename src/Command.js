import help from './commands/help';
import {
    pwd,
    ls,
    cd
} from './commands/fs';

const ERROR_COMMAND_NOT_FOUND = (command) => `-bash: ${command}: command not found`;

const now = (m) => Promise.resolve(m);
const delay = (m, d) => new Promise((resolve) => setTimeout(() => resolve(m), d));

export default class Command {
    exec(input) {
        const [command, ...args] = input.split(' ');

        switch (command) {
            case 'help':
                return now(help(...args));
            case 'ls':
                return now(ls());
            case 'pwd':
                return now(pwd());
            case 'cd':
                return cd(...args);
            default:
                return now(ERROR_COMMAND_NOT_FOUND(command));
        }
    }
}