export const defaultMashine = '*Me';

let current = defaultMashine;

import {
    hacker,
    lauren,
    plague,
    gibson,
    common
} from './structures';

const mashines = {
    '*Me': {
        dir: ['home', 'zerocool'],
        network: 'common',
        access: ['common'],
        need_ssh_key: false,
        ip: '199.19.14.201',
        password: false,
        structure: hacker
    },
    Lauren_PC: {
        dir: ['home', 'lauren'],
        network: 'common',
        access: ['common', 'emc'],
        need_ssh_key: false,
        ip: '198.41.10.124',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        structure: lauren
    },
    plague: {
        dir: ['home', 'plague'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: false,
        ip: '199.27.91.131',
        password: '73bcaaa458bff0d27989ed331b68b64d',
        structure: plague
    },
    EMC_gibson: {
        dir: ['home', 'root'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '192.15.45.241',
        structure: gibson
    },
    EMC_rucker: {
        dir: ['home', 'root'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '193.10.14.129',
        structure: common
    },
    EMC_sterling: {
        dir: ['home', 'root'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '202.12.27.133',
        structure: common
    }
}

export const currentMashine = () => mashines[current];
export const currentDir = () => currentMashine().dir;
export const currentStructure = () => currentMashine().structure; 

export const getMashine = (name) => mashines[name];

export const availableNetworks = () => {
    const {access} = mashines[current];

    return Object.keys(mashines).reduce((list, name) => {
        if (current !== name) {
            const {network, ip} = mashines[name];

            if (access.includes(network)) {
                list.push({name, ip});
            }
        }

        return list;
    }, []);
}

export function findByIp(ip) {
    return Object.keys(mashines).filter((name) => mashines[name].ip === ip)[0];
}

export function isCurrent(name) {
    return current === name;
}

export function isAvailable(name) {
    return mashines[current].access.includes(mashines[name].network);
}

export function setCurrent(name) {
    current = name;
}
