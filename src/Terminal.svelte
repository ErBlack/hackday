<script>
import Command from './Command.js';

const command = new Command();

let bash_history = [];

function onSubmit(e) {
    e.preventDefault();

    const value = e.target.command.value;

    if (value === '') return;

    bash_history = bash_history.concat({
        command: value,
        result: command.exec(value)
    });
    e.target.command.value = '';
}
</script>

<style>
input {
    background: transparent;
    border: none;
    font: inherit;
    color: inherit;
    outline: none;
    margin: 0;
    padding: 0;
}
</style>

{#each bash_history as {command, result}}
    <div class="row">> {command}</div>
    <div class="row">{result}</div>
{/each}
<form on:submit={onSubmit}>
> <input name="command">
</form>