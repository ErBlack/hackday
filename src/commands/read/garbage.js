export default function garbage() {
    return `Юджин, он же the Plague использовал червя
для кражи 25 миллионов долларов.
 _                _ 
| |              | |
| |__   __ _  ___| | _____ _ __ 
| '_ \\ / _' |/ __| |/ / _ \\ '__|
| | | | (_| | (__|   <  __/ |
|_| |_|\\__,_|\\___|_|\\_\\___|_|

Ты нашел доказательства. Держи код:

${code()}

Пришли его мне.
`;
}

const code = () => encrypt(String(Date.now()).slice(0, -1));

function encrypt(string) {
    return string
        .split('')
        .map((letter, i) => {
            return String.fromCharCode(letter.charCodeAt(0) + 16 + i) +
                ((i === string.length - 1) || (i + 1) % 4 ? '' : '-');
        })
        .join('');
}