<script lang="ts">
	import { io } from "$lib/WebSocket";
	import type { Room } from "../room/definitions/Room";
	
	
	export let rooms: Room[] = [];

	let dialog: HTMLDialogElement;
	let select: HTMLSelectElement;

	function openDialog() {
		dialog.showModal();
	}

	function confirm(e: Event) {
        e.preventDefault();
		if(select.value === 'default') return;

		console.log(select.value);
		dialog.close();
		io.emit('join_room', select.value);
	}
</script>

<button on:click={openDialog}>Join Room</button>

<dialog bind:this={dialog}>
	<form on:submit={confirm}>
		<p>
			<label>
				Select Room:
				<select bind:this={select}>
					<option value="default">Choose…</option>
                    {#each rooms as i}
                        <option value={i.name} >{i.name} ({i.status})</option>
                    {/each}
				</select>
			</label>
		</p>
		<div>
			<button type="button" on:click={() => {
				dialog.close();
			}}>Cancel</button>
			<button type="submit">Confirm</button>
		</div>
	</form>
</dialog>
