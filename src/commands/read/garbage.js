export default function garbage() {
    return `Юджин, он же the Plague использовал червя
для кражи 25 миллионов долларов.
 _                _ 
| |              | |
| |__   __ _  ___| | _____ _ __ 
| '_ \\ / _' |/ __| |/ / _ \\ '__|
| | | | (_| | (__|   <  __/ |
|_| |_|\\__,_|\\___|_|\\_\\___|_|

Ты нашел доказательства.
Но ты не был первым.

Взломано за 44 минуты и 32 секунды
01.10.2019, 20:44:32 @hackerteam

<img src="${h.src}" alt="hack" width="404px" height="290px"/>
`;
}

const h = new Image();
h.src = '/hackday/h.png';

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