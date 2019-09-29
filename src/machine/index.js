export const defaultMachine = '*Me';

let current = defaultMachine;

import {
    hacker,
    lauren,
    plague,
    gibson,
    common
} from './structures';
import {levelup} from '../ost';

const machines = {
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
        structure: lauren,
        visited: false
    },
    plague: {
        dir: ['home', 'plague'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: false,
        ip: '199.27.91.131',
        password: '73bcaaa458bff0d27989ed331b68b64d',
        structure: plague,
        visited: false
    },
    EMC_gibson: {
        dir: ['home', 'root'],
        network: 'emc',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '192.15.45.241',
        structure: gibson,
        visited: false
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

export const currentMachine = () => machines[current];
export const currentDir = () => currentMachine().dir;
export const currentStructure = () => currentMachine().structure; 

export const getMachine = (name) => machines[name];

export const availableNetworks = () => {
    const {access} = machines[current];

    return Object.keys(machines).reduce((list, name) => {
        if (current !== name) {
            const {network, ip} = machines[name];

            if (access.includes(network)) {
                list.push({name, ip});
            }
        }

        return list;
    }, []);
}

export function findByIp(ip) {
    return Object.keys(machines).filter((name) => machines[name].ip === ip)[0];
}

export function isCurrent(name) {
    return current === name;
}

export function isAvailable(name) {
    return machines[current].access.includes(machines[name].network);
}

export function setCurrent(name) {
    current = name;

    if (currentMachine().visited === false) {
        currentMachine().visited === true;
        levelup.play();
    }
}
