<script lang="ts">
	import { io } from '$lib/WebSocket';
	import { onMount } from 'svelte';
	import OpenRooms from './OpenRooms.svelte';
	import type { Room } from '../room/definitions/Room';
	
    
    export let username: string;

	const createRoom = () => {
		io.emit('create_room', username);
	};

    let rooms: Room[] = [];

    onMount(() => {
        io.on('rooms', (message: Room[]) => {
            rooms = message;
            console.log(rooms)
        })

        io.emit('get_rooms');
    })
</script>

<h1>Lobby</h1>

<!-- Buttons to join and create a new room -->
<button on:click={createRoom}>Create Room</button>

<!-- A list of open rooms -->

<OpenRooms {rooms} />
