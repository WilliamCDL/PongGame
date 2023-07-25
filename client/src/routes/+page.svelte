<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { authStore } from '../stores/authStore';
	import { goto } from '$app/navigation';

	onMount(() => {
		authStore.subscribe((value) => {
			if (!value.isAuth) {
				goto('/login');
				return;
			} else {
				goto('/home');
			}
		});
	});
</script>

<svelte:head>
	<title>Loading</title>
	<meta name="description" content="Pong game" />
</svelte:head>


Loading...