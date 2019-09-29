import structure from './structure';

const ERROR_DIRECTORY_NOT_FOUND = (command) => `-bash: cd: ${command}: No such file or directory`;
const ERROR_NOT_DIRECTORY = (command) => `-bash: cd: ${command}: Not a directory`;

const currentDir = [
    'home',
    'user'
];

const row = '                                          ';

function findCurrentDir() {
    return currentDir.reduce((dir, name) => dir[name].contents, structure);
}

function formatSize(size) {
    return `${size}b`;
}

export function pwd() {
    return currentDir.length ? `/${currentDir.join('/')}/` : '/';
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
                    const size = formatSize(dir[name].size);
                    return `${name}${row.slice(name.length + size.length)}${size}`;
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
            currentDir.pop();
            return Promise.resolve();
        default:
            const dirTarget = findCurrentDir()[target];

            if (!dirTarget) {
                return Promise.resolve(ERROR_DIRECTORY_NOT_FOUND(target));
            } else if (dirTarget.type !== 'directory') {
                return Promise.resolve(ERROR_NOT_DIRECTORY(target));
            }

            currentDir.push(target);

            return Promise.resolve();
    }
}