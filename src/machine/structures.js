import structure from './structure';

const clone = () => JSON.parse(JSON.stringify(structure));

export const hacker = clone();

hacker.home.contents.zerocool = {
    type: 'directory',
    contents: {
        '.bash_history': {
            type: 'file',
            size: 201
        },
        '.bash_logout': {
            type: 'file',
            size: 220
        },
        '.bashrc': {
            type: 'file',
            size: 3771
        },
        '.profile': {
            type: 'file',
            size: 807
        },
        'hack_plan.txt': {
            type: 'file',
            size: 356
        }
    }
};

export const lauren = clone();

lauren.home.contents.lauren = {
    type: 'directory',
    contents: {
        mail: {
            type: 'directory',
            contents: {
                'КвартальныйОтчет.mlm': {
                    type: 'file',
                    size: 112
                },
                'СделкаСКитаем.mlm': {
                    type: 'file',
                    size: 268
                },
                'СменаПароля.mlm': {
                    type: 'file',
                    size: 150
                }
            }
        },
        '.bash_history': {
            type: 'file',
            size: 201
        },
        '.bash_logout': {
            type: 'file',
            size: 220
        },
        '.bashrc': {
            type: 'file',
            size: 3771
        },
        '.profile': {
            type: 'file',
            size: 807
        }
    }
};

export const plague = clone();

plague.home.contents.plague = {
    type: 'directory',
    contents: {
        mail: {
            type: 'directory',
            contents: {
                'FontAwesome.mlm': {
                    type: 'file',
                    size: 112
                },
                'Пароль.mlm': {
                    type: 'file',
                    size: 150
                }
            }
        },
        ssh: {
            type: 'directory',
            contents: {
                'id_rsa': {
                    type: 'file',
                    size: 231
                }
            }
        },
        '.bash_history': {
            type: 'file',
            size: 201
        },
        '.bash_logout': {
            type: 'file',
            size: 220
        },
        '.bashrc': {
            type: 'file',
            size: 3771
        },
        '.profile': {
            type: 'file',
            size: 807
        }
    }
};

export const gibson = clone();

gibson.home.contents.root = {
    type: 'directory',
    contents: {
        '.bash_history': {
            type: 'file',
            size: 201
        },
        '.bash_logout': {
            type: 'file',
            size: 220
        },
        '.bashrc': {
            type: 'file',
            size: 3771
        },
        '.profile': {
            type: 'file',
            size: 807
        }
    }
};

gibson.junk.contents.garbage = {
    type: 'file',
    size: 8845
}

export const common = clone();

common.home.contents.root = {
    type: 'directory',
    contents: {
        '.bash_history': {
            type: 'file',
            size: 201
        },
        '.bash_logout': {
            type: 'file',
            size: 220
        },
        '.bashrc': {
            type: 'file',
            size: 3771
        },
        '.profile': {
            type: 'file',
            size: 807
        }
    }
};