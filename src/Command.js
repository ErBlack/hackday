const ERROR_COMMAND_NOT_FOUND = (command) => `-bash: ${command}: command not found`;

export default class Command {
    exec(command) {
        switch (command) {
            default:
                return ERROR_COMMAND_NOT_FOUND(command);
        }
    }
}