<script>
import Command from './Command.js';
import Await from './Await.svelte';

import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

function execDone() {
    dispatch('exec');
}

const command = new Command();

let bash_history = [];
let readonly = false;

function onSubmit(e) {
    e.preventDefault();

    const value = e.target.command.value;

    if (value === '') return;

    e.target.command.value = '';

    if (value === 'clear') {
        bash_history = [];
        return;
    }

    readonly = true;
    bash_history = bash_history.concat({
        command: value,
        result: command.exec(value).finally(() => {
            readonly = false;
            execDone();
        })
    });
}
</script>

<style>
.terminal {
    flex-grow: 1;
    margin-bottom: 3em;
}

input {
    background: transparent;
    border: none;
    font: inherit;
    color: inherit;
    outline: none;
    margin: 0;
    padding: 0;
}

form {
    display: none;
}

form.readonly {
    opacity: 0;
}

.row {
    white-space: pre-wrap;
}
</style>
<section class="terminal">
    {#each bash_history as {command, result}}
        <div class="row">> {command}</div>
        {#await result}> <Await/>{:then message}
            <div class="row">{message}</div>
        {:catch error}
            <div class="row row_error">{error.message}</div>
        {/await}
    {/each}
    <form class={readonly ? 'readonly' : ''} on:submit={onSubmit} {readonly}>
    > <input name="command" {readonly}>
    </form>
</section>