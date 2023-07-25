<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, baseUrl, register } from '../../stores/authStore.js';
    import { goto } from '$app/navigation';

	let email = '';
	let username = '';
	let password = '';

	let message: string = '';
	let error: string = '';

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		const user = {
			email,
			username,
			password
		};

        message = ''
        error = ''
        
        try{
            message = await register(user);
            password = '';
            goto('/');
        }catch(e: any){
            error = e.message;
        }
    }
</script>

<div class="container">
	<form on:submit={handleSubmit}>
		<h3>Criar conta</h3>

		<!-- Message -->
		{#if message}
			<p class="success-message">{message}</p>
		{/if}
		{#if error}
			<p class="error-message">{error}</p>
		{/if}

		<label for="email">Email</label>
		<input type="email" bind:value={email} name="email" id="email" required />

		<label for="username">Username</label>
		<input type="text" bind:value={username} name="username" id="username" required />

		<label for="password">Senha</label>
		<input type="password" bind:value={password} name="password" id="password" required />

		<button type="submit">Registrar</button>
		<p>
			Já tem uma conta?
			<a class="link" href="/login"> 
				Entrar
			</a>
		</p>
	</form>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	form {
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 2rem;
	}

	/* Shadow in the form */
	form {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}

	/* Form elements */
	input {
		margin-bottom: 1rem;
		padding: 0.5rem;
	}

	/* Nice blue register button */
	button {
		margin-top: 1rem;
		padding: 0.5rem;
		background-color: #0077ff;
		color: white;
		border: none;
		border-radius: 0.25rem;
	}

	/* Nice hover effect on the button */
	button:hover {
		background-color: #0066cc;
	}

	/* Nice click effect on the button */
	button:active {
		background-color: #0052cc;
	}

	h3 {
		margin-bottom: 1rem;
		margin-top: 0;
	}

	.error-message {
		color: red;
	}

	.success-message {
		color: green;
	}
	
	.link {
		color: #0077ff;
		text-decoration: none;
	}
</style>
