<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Chat from '../../chat/Chat.svelte';
	import Lobby from '../Lobby.svelte';
	import Pong from '../../pong/Pong.svelte';
	import { io } from '$lib/WebSocket';
	import { PlayerRoomStatus } from '$lib/PlayerRoomStatus';
	import type { Room } from '../../room/definitions/Room';
	import RoomVisual from '../../room/RoomVisual.svelte';
	import { authStore, logout } from '../../stores/authStore';
	import { goto } from '$app/navigation';

	let username: string;
	let room: Room;
	let status = PlayerRoomStatus.LOBBY;

	function logoutButton() {
		logout();
		goto('/login');
	}

	onMount(() => {
		io.connect();

		authStore.subscribe((value) => {
			if (!value.isAuth) {
				goto('/login');
				return;
			}
			username = value.user ? value.user.username : '';
			io.emit('username', username);
		});

		io.on('room_created', (message) => {
			status = PlayerRoomStatus.JOINED;
			room = message;
		});

		io.on('joined_room', (message) => {
			status = PlayerRoomStatus.JOINED;
			room = message;
		});

		io.on('started', (message) => {
			room = message;
			status = PlayerRoomStatus.STARTED;
		});

		io.on('finished', () => {
			status = PlayerRoomStatus.FINISHED;
		});

		io.on('left_room', () => {
			status = PlayerRoomStatus.LOBBY;
		});

		io.on('disconnect', () => {
			authStore.update((state) => {
				state.isAuth = false;
				state.user = undefined;
				return state;
			});
		});
	});

	onDestroy(() => {
		io.disconnect();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Pong game" />
</svelte:head>

{#if $authStore.isAuth}
	<button class="logout-button" on:click={logoutButton}>Logout</button>

	{username}
	<div class="page">
		<div class="left card">
			{#if status === PlayerRoomStatus.LOBBY}
				<Lobby {username} />
			{/if}
			{#if status === PlayerRoomStatus.JOINED || status === PlayerRoomStatus.STARTED || status === PlayerRoomStatus.FINISHED}
				<RoomVisual {username} {room} {status} />
			{/if}
		</div>

		<div class="right card">
			{#if status === PlayerRoomStatus.STARTED}
				<Pong {room} {username} />
			{:else}
				<Chat {username} />
			{/if}
		</div>
	</div>
{/if}

<style>
	.page {
		display: flex;
		flex-direction: row;
		column-gap: 1em;

		height: 100vh;
	}

	.left {
		flex: 1;
	}

	.right {
		flex: 1;
	}

	.card {
		background-color: #fff;
		border-radius: 3px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		margin: 0 0 1rem 0;
		padding: 1rem;
	}
</style>
