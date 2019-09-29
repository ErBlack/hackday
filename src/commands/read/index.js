
import bin from './bin.js';

const print = (content) => `
${content}

`;

export default function read(name, bash_history) {
    if (files[name]) {
        return print(files[name]);
    } else if (name === '.bash_history') {
        return print(bash_history.map(({command}) => command).join('\n'));
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
fi`
}