<script lang="ts">
	import type { Match } from '../../definitions/Match'

	const columns = [
		{
			label: 'Resultado',
			index: 'result'
		},
		{
			label: 'Timer',
			index: 'duration'
		}
	];
	let history:  Array<Match> = [];
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>Historico de partidas</h1>
	<table>
		<tr>
			{#each columns as th}
				<th>{th.label}</th>
			{/each}
		</tr>
		{#each history as match}
		<tr>
			{#each columns as td}
			<td>Alfreds Futterkiste</td>

			{/each}
		</tr>
		{/each}
	</table>
</div>
