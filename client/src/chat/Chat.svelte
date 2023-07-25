<script lang="ts">
	import { io } from "$lib/WebSocket";
	import { onMount } from "svelte";
	import type { ChatMessage } from "./definitions/ChatMessage";

    export let username: string;
    
    let chat: ChatMessage[] = [];

    // HTML Elements
    let messageInput: HTMLTextAreaElement;
    let chatScroll: HTMLDivElement;

    let isHoldingShift = false;

    function sendMessage(e: Event){
        e.preventDefault();
        const message = messageInput.value;
        io.emit('message', message);
        messageInput.value = '';
    }

    onMount(() => {
        // Clear messageInput
        messageInput.value = '';

        io.on('message', (message: ChatMessage) => {
			chat = [...chat, message];
            setTimeout(() => {
                chatScroll.scrollTop = chatScroll.scrollHeight;
            }, 100)
		});
    })

</script>

<div class="chat">
    <div class="scroll" bind:this={chatScroll} >
        {#each chat as message}
            {#if message.username === 'system'}
                <div class="system-message">
                    <p>{message.message}</p>
                </div>
            {:else}
                <div class="message {message.username == username ? 'my-messages' : 'others'}">
                    <p><b>{ message.username != username ? message.username+": ": ''}</b>
                    {message.message}</p>
                </div>
            {/if}
        {/each}
    </div>
    <form on:submit={sendMessage}>
        <textarea name="message" on:keydown={e => {
            if(e.key === 'Shift'){
                isHoldingShift = true;
            }
        }}
        on:keyup={e => {
            if(e.key === 'Shift'){
                isHoldingShift = false;
            }
        }} on:keypress={(e) => {
            if(e.key === 'Enter' && !isHoldingShift){
                sendMessage(e);
            }
        }} bind:this={messageInput}>
        </textarea>
        <button type="submit">Enviar</button>
    </form>
</div>
    
<style>
    .message {
        border: 1px solid black;
        padding: 5px;
        margin: 10px;
    }

    .message p,  .system-message p {
        margin: 0;
    }
    .system-message {
        border: 1px solid black;
        padding: 5px;
        margin: 10px;
        color: green;
        font-size: 0.6em;
    }

    .my-messages {
        text-align: right;
    }

    .scroll {
        height: 80vh;
        overflow-y: scroll;
    }
</style>