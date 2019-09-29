let ssh_key = false;

export const has_ssh_key = () => ssh_key;

export default function sshAdd(name) {
    if (name === 'id_rsa') {
        ssh_key = true;
        return `Identity added: ${name}`;
    } else {
        return `Incorrect key file: ${name}`;
    }
}