<script>
import Command from './Command.js';
import Await from './Await.svelte';

import { createEventDispatcher } from 'svelte';

import {start} from './ost.js';

const hackStart = new Date('2019-10-01T17:00:00.000Z');

const dispatch = createEventDispatcher();

function execDone() {
    dispatch('exec');
}

const command = new Command();

let bash_history = [];
let readonly = false;
let unlocked = false;

function onInput(e) {
    if (unlocked) return;

    const v = e.target.value.toLowerCase();

    {
        if (v[0] !== 'h') {
            e.target.value = v[0] === 'р' ? 'h' : '';
        } else if (v[1] !== 'a') {
            e.target.value = v[1] === 'ф' ? 'ha' : 'h';
        } else if (v[2] !== 'c') {
            e.target.value = v[2] === 'с' ? 'hac' : 'ha';
        } else if (v[3] !== 'k' && v[3] !== 'л') {
            e.target.value = 'hac';
        } else {
            e.target.value = '';
            unlocked = true;
            start.play();
        }
    }
}

function onSubmit(e) {
    e.preventDefault();

    if (!unlocked) return;
    
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
        result: command.exec(value, bash_history).finally(() => {
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

form {
    display: flex;
    flex-direction: row-reverse;
}

input {
    background: transparent;
    border: none;
    font: inherit;
    color: inherit;
    outline: none;
    margin: 0;
    padding: 0;
    flex-grow: 1;
}

form.readonly {
    opacity: 0;
}

.row {
    white-space: pre-wrap;
}

.prompt {
    opacity: 0;
    margin-right: .6em;
    transition: opacity .3s ease-out;
    flex-shrink: 0;
}

input:focus + .prompt,
input:not(:placeholder-shown) + .prompt {
    opacity: 1;
}
</style>
<section class="terminal">
    {#if window.location.search === '?beta' || Date.now() > hackStart}
    {#each bash_history as {command, result}}
        <div class="row">> {command}</div>
        {#await result}> <Await/>{:then message}
            {#if message}
                <div class="row">{@html message}</div>
            {/if}
        {:catch error}
            <div class="row row_error">{error.message}</div>
        {/await}
    {/each}
    <form class={readonly ? 'readonly' : ''} on:submit={onSubmit}>
        <input name="command" placeholder=" " on:input={onInput} {readonly}>
        <span class="prompt">></span>
    </form>
    {/if}
</section>