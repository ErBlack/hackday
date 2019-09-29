import {
    currentDir,
    currentStructure
} from './mashine';

const ERROR_DIRECTORY_NOT_FOUND = (command) => `-bash: cd: ${command}: No such file or directory`;
const ERROR_NOT_DIRECTORY = (command) => `-bash: cd: ${command}: Not a directory`;
const ERROR_NO_FILE = (command) => `read: ${command}: No such file`;
const ERROR_IS_DIRECTORY = (command) => `read: ${command}: Is a directory`;

const row = '                                          ';

export function toRow(a, b) {
    return `${a}${row.slice(a.length + b.length)}${b}`
}

function findCurrentDir() {
    return currentDir().reduce((dir, name) => dir[name].contents, currentStructure());
}

function formatSize(size) {
    return `${size}b`;
}

export function pwd() {
    return currentDir().length ? `/${currentDir().join('/')}/` : '/';
}

export function ls() {
    const dir = findCurrentDir();

    return '\n' + Object
        .keys(dir)
        .map((name) => {
            switch (dir[name].type) {
                case 'directory':
                    return `${name}/`;
                case 'file':
                    return toRow(name, formatSize(dir[name].size));
                default:
                    return '***'
            }
        })
        .join('\n') + '\n\n';
}

export function cd(target) {
    switch (target) {
        case undefined:
        case '':
        case './':
            return Promise.resolve();
        case '../':
            currentDir().pop();
            return Promise.resolve();
        default:
            const dirTarget = findCurrentDir()[target];

            if (!dirTarget) {
                return Promise.resolve(ERROR_DIRECTORY_NOT_FOUND(target));
            } else if (dirTarget.type !== 'directory') {
                return Promise.resolve(ERROR_NOT_DIRECTORY(target));
            }

            currentDir().push(target);

            return Promise.resolve();
    }
}

export function checkFile(name) {
    const file = findCurrentDir()[name];

    if (!file) {
        return ERROR_NO_FILE(name);
    } else if (file.type === 'directory') {
        return ERROR_IS_DIRECTORY(name);
    }
}