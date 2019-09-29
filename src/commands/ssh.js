const ERROR_INVALID_IP = (ip) => `ssh: ${ip}: Invalid ip adress, use scan to find`;
const ERROR_UNKNOWN_HOST = (ip) => `ssh: connect to host ${ip}: Cannot assign requested address`;
const ERROR_LOCAL_HOST = (ip) => `ssh: connect to host ${ip}: Connection refused`;
const ERROR_WRONG_PASSWORD = 'ssh: incorrect password';
const ERROR_KEY_NEEDED = 'ssh: rsa key needed';

const IP_REG = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

import md5 from 'md5';

import {has_ssh_key} from './ssh-add';

import {
    findByIp,
    isCurrent,
    isAvailable,
    getMashine,
    setCurrent
} from './fs/mashine';

export default function ssh(ip) {
    if (!IP_REG.test(ip)) return ERROR_INVALID_IP(ip);

    const target = findByIp(ip);

    if (!target) return ERROR_UNKNOWN_HOST(ip);
    if (isCurrent(target)) return ERROR_LOCAL_HOST(ip);
    if (!isAvailable(target)) return ERROR_UNKNOWN_HOST(ip);

    const {
        password,
        need_ssh_key
    } = getMashine(target);

    let auth;

    if (password === false) {
        auth = true;
    }

    if (password) {
        if (password !== md5(prompt('Введите пароль'))) return ERROR_WRONG_PASSWORD;
        auth = true
    }

    if (need_ssh_key) {
        if (!has_ssh_key()) return ERROR_KEY_NEEDED;
        auth = true;
    }

    if (auth) {
        setCurrent(target);

        return `
Welcome to ${target}

`;
    }
}