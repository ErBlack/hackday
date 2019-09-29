
import bin from './bin.js';

const print = (content) => `
${content}

`;

export default function read(name) {
    if (files[name]) {
        return print(files[name]);
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
fi`
}