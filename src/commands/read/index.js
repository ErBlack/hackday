
import bin from './bin.js';
import {final} from '../../ost';

const print = (content) => `
${content}

`;

export default function read(name, bash_history) {
    if (files[name]) {
        return print(files[name]);
    } else if (name === '.bash_history') {
        return print(bash_history.map(({command}) => command).join('\n'));
    } else if (name === 'garbage') {
        final.play();
        return print('cool');
    } else {
        return print(bin(name));
    }
}

const files = {
    '.profile': `# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi`,
    '.bashrc': `case $- in
    *i*) ;;
      *) return;;
esac

HISTCONTROL=ignoreboth

shopt -s histappend

HISTSIZE=1000
HISTFILESIZE=2000

shopt -s checkwinsize

[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

if [ -z "\${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
debian_chroot = $(cat / etc / debian_chroot)
fi

case "$TERM" in
    xterm - color |* -256color) color_prompt = yes;;
esac

if !shopt - oq posix; then
if [-f / usr / share / bash - completion / bash_completion]; then
    . / usr / share / bash - completion / bash_completion
elif[-f / etc / bash_completion]; then
    . / etc / bash_completion
fi
fi`,
    '.bash_logout': `# ~/.bash_logout: executed by bash(1) when login shell exits.

# when leaving the console clear the screen to increase privacy

if [ "$SHLVL" = 1 ]; then
    [ -x /usr/bin/clear_console ] && /usr/bin/clear_console -q
fi`,
    'hack_plan.txt': `Hack Ellingson Mineral Company

1. Lauren_PC: Коммерческий департамент
   [Лорен Мерфи]

   У неё должен быть простой пароль. Нужно
   попробовать самые распространённые.
   В википедии был список.

   Её компьютер подключен к сети EMC.
   Через него можно проникнуть в Гибсон.

2. plague: Служба безопасности
   [Юджин Белфорд]

   Мутный тип. Говорят у него интрижка с
   Лорен из коммерческого департамента.
   Стоит проверить её почту.

   На его машине должен быть ключ к
   Гибсону

3. EMC_gibson: Супер компьютер Гибсон.

   Доступ по паролю закрыт. Нужно достать
   ключ, чтобы подключиться.

   На Гибсоне могли остаться следы
   махинаций The Plague. Нужно отыскать
   их, чтобы вытащить Джоя.

   Возможно the Plague пытался замести
   следы. Стоит поискать в системной
   корзине (/junk)
`,
    'СменаПароля.mlm': `RE: Смена Пароля

Ло, ты снова выбрала САМЫЙ распространённый пароль года.
Не понимаю, как тебе это удаётся. Ты просто предвосхищаешь результаты статистики! Прояви воображение =)

Серьёзно. Твой компьютер доступен из внешней сети.
Это я могу использовать в качестве пароля код на бессмертие из игры DOOM.
Но тебе надо выбирать пароль, обеспечивающий хоть какую-то защиту.
Попробуй вписать цитату из книги, или ещё что-то такое.

Я пока отключил автоматическое оповещение безопасности, чтобы тебе не мешали работать.
Но поменяй пароль ASAP.

PS: Я уже заказал столик. Встречаемся в восемь.

-------------
Юджин Белфорд
Руководитель службы безопасности
`
}