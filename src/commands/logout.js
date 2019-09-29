import {
    defaultMashine,
    setCurrent
} from './fs/mashine';

export default function logout() {
    setCurrent(defaultMashine);

    return `
Welcome home

`;
}