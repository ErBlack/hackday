import rows from './bin.json';

export default function bin(name) {
    return name
        .split('')
        .map((char) => rows[char.charCodeAt(0) % 43])
        .join('\n')
}