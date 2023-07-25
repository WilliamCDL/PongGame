<script lang="ts">
	import { io } from '$lib/WebSocket';
	import { onMount } from 'svelte';
	import type { Room } from './definitions/Room';

    export let username: string;
    export let room: Room;
    export let status: string;

    let players: string[] = [];
    let roomLog: string[] = [
        "Bem vindo a sala! Aqui você pode conversar com os outros jogadores e ver o log da sala."
    ];

    // HTML
    let roomLogScroll: HTMLPreElement;

    function exitRoom(){
        io.emit('leave_room', room.name);
    }

    function startGame(){
        io.emit('start_game', room.name);
    }

    onMount(() => {
        io.on('room_status', (message) => {
            console.log(message);
            if(message.message)
                roomLog = [...roomLog, message.message];
            if(message.players){
                players = message.players;
            }
            setTimeout(() => {
                roomLogScroll.scrollTop = roomLogScroll.scrollHeight;
            }, 100);
        });

        io.emit('get_room_status', room.name);
    })
</script>


<h2>Sala: {room.name}</h2>

{#if room && room.owner == username}
    <button on:click={startGame}>Iniciar partida</button>
{/if}
<button on:click={exitRoom}>Sair</button>

<h2>Jogadores:</h2>
<div class="black-panel">
    <ul>
        {#each players as player}
        <li>{player}</li>
        {/each}
    </ul>
</div>

<h2>Room Log</h2>
<pre class="black-panel" bind:this={roomLogScroll}>
    {#each roomLog as log}
        {log + '\n\n'}
    {/each}
</pre>

<style>
    .black-panel{
        background-color: #000;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        height: 200px;
        overflow-y: scroll;
        font-size: 0.8em;
        white-space: break-spaces;
    }
</style>