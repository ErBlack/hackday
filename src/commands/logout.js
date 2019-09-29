import {
    defaultMachine,
    setCurrent
} from '../machine';

export default function logout() {
    setCurrent(defaultMachine);

    return `
Welcome home

`;
}