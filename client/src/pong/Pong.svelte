<script lang="ts">
	import { onMount } from 'svelte';
	import { drawCircle, drawLine } from './systems/utils/canvasApi';
	import { GameBlock } from './definitions/Block';
	import type { Block } from './definitions/Block';
	import type { Ball } from './definitions/Ball';
	import { ballPhisics, colliderBallPlayer } from './systems/Physics/BallPhysics';
	import { playerCollision, colliderPlayerWall } from './systems/Physics/PlayerPhisics';
	import { wallCollition, colliderBallWall } from './systems/Physics/WallPhisics';
	import {
		displayScore,
		displayTimer,
		displayVictoryLeft,
		displayVictoryRight,
		drawBlock
	} from './systems/Visuals/Visuals';
	import type { Score } from './definitions/Score';
	import { io } from '$lib/WebSocket/index';
	import type { Room } from '../room/definitions/Room';

	export let username: string;
	export let room: Room;

	let isPlaying = false;

	let ballIsVisible = true;
	let lineIsVisible = true;

	let timerIsVisible = false;
	let timer = 3;

	let victoryLeftIsVisible = false;
	let victoryRightIsVisible = false;

	let score: Score = {
		left: 0,
		right: 0
	};

	let currentPlayerIsLeft = true;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	const width = 400;
	const height = 300;

	const ball: Ball = {
		r: 10,
		position: {
			x: width / 2,
			y: height / 2
		},
		velocity: {
			x: 0,
			y: 0
		}
	};

	const playerLeft = new GameBlock({ x: 5, y: height / 2 }, 5, 50, playerCollision);
	const playerRight = new GameBlock({ x: width - 5, y: height / 2 }, 5, 50, playerCollision);
	const upperWall = new GameBlock({ x: width / 2, y: -495 }, 400, 1000, wallCollition);
	const lowerWall = new GameBlock({ x: width / 2, y: 795 }, 400, 1000, wallCollition);

	const wallBlocks: Array<GameBlock> = [upperWall, lowerWall];
	const players: Array<GameBlock> = [playerLeft, playerRight];

	function resetMatch() {
		score.left = 0;
		score.right = 0;

		victoryLeftIsVisible = false;
		victoryRightIsVisible = false;

		ballIsVisible = true;
		lineIsVisible = true;
	}

	function resetGame() {
		isPlaying = false;

		ball.position = {
			x: width / 2,
			y: height / 2
		};
		ball.velocity = {
			x: 0,
			y: 0
		};
	}

	function startGame() {
		isPlaying = true;
		ball.velocity = {
			x: 1,
			y: 2
		};
	}

	const SECONDS = 1000;
	function startCoundDown() {
		timer = 3;
		timerIsVisible = true;
		setTimeout(() => {
			timer = 2;
			setTimeout(() => {
				timer = 1;
				setTimeout(() => {
					timer = 0;
					timerIsVisible = false;
					startGame();
				}, SECONDS);
			}, SECONDS);
		}, SECONDS);
	}

	export function victory() {
		ballIsVisible = false;
		lineIsVisible = false;

		resetGame();

		setTimeout(() => {
			ballIsVisible = true;
			lineIsVisible = true;
			resetMatch();
			startCoundDown();
		}, 5 * SECONDS);
	}

	function draw(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, width, height);

		// Próximos retangulos serão pretos
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Os próximos retangulus serão brancos
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';

		// Jogadores
		drawBlock(ctx, playerLeft);
		drawBlock(ctx, playerRight);

		// Rede
		if (lineIsVisible) drawLine(ctx, width / 2, 0, width / 2, height);

		// Bola
		if (ballIsVisible) {
			drawCircle(ctx, ball.position.x, ball.position.y, ball.r);
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		}

		// Paredes
		drawBlock(ctx, upperWall);
		drawBlock(ctx, lowerWall);

		if (timerIsVisible) {
			displayTimer(ctx, timer);
		}

		displayScore(ctx, score);

		if (victoryLeftIsVisible) {
			displayVictoryLeft(ctx, room.players.right == username);
		}
		if (victoryRightIsVisible) {
			displayVictoryRight(ctx, room.players.left == username);
		}
	}

	function updateGameState() {
		ballPhisics(ball);
		// Physics
		wallBlocks.forEach((block) => colliderBallWall(ball, block));
		players.forEach((block) => colliderBallPlayer(ball, block));

		if (isPlaying) {
			if (ball.position.x - ball.r > width) {
				score.left++;
				if (score.left < 10) {
					resetGame();
					startCoundDown();
					return;
				}
				victoryLeftIsVisible = true;
				victory();
				return;
			}
			if (ball.position.x + ball.r < 0) {
				score.right++;
				if (score.right < 10) {
					resetGame();
					startCoundDown();
					return;
				}
				victoryRightIsVisible = true;
				victory();
				return;
			}
		}
	}

	function updateCanvas() {
		draw(context);

		if (room.players.left == username) {
			if (isPlaying) updateGameState();

			io.emit('game-state', {
				roomName: room.name,
				value: {
					ball: ball,
					score: score,
					isPlaying: isPlaying,
					victoryLeftIsVisible: victoryLeftIsVisible,
					victoryRightIsVisible: victoryRightIsVisible,
					timerIsVisible: timerIsVisible,
					timer: timer,
					ballIsVisible: ballIsVisible,
					lineIsVisible: lineIsVisible
				}
			});
		}
		window.requestAnimationFrame(updateCanvas);
	}

	onMount(() => {
		io.on('y-right', (message) => {
			if (room.players.right != username) {
				playerRight.position.y = message;
				colliderPlayerWall(playerRight, upperWall);
				colliderPlayerWall(playerRight, lowerWall);
			}
		});

		io.on('y-left', (message) => {
			if (room.players.left != username) {
				playerLeft.position.y = message;
				colliderPlayerWall(playerLeft, upperWall);
				colliderPlayerWall(playerLeft, lowerWall);
			}
		});

		io.on('game-state', (message) => {
			if (room.players.left != username) {
				ball.position = message.ball.position;
				ball.velocity = message.ball.velocity;
				score.left = message.score.left;
				score.right = message.score.right;
				isPlaying = message.isPlaying;
				victoryLeftIsVisible = message.victoryLeftIsVisible;
				victoryRightIsVisible = message.victoryRightIsVisible;
				timerIsVisible = message.timerIsVisible;
				timer = message.timer;
				ballIsVisible = message.ballIsVisible;
				lineIsVisible = message.lineIsVisible;
			}
		});

		context = canvas.getContext('2d') as CanvasRenderingContext2D;
		updateCanvas();

		addEventListener('mousemove', (e) => {
			// Repositionar jogador
			if (room.players.left == username) {
				playerLeft.position.y = e.clientY;

				// A posição do jogador precisa ser corrigida aqui
				// porque esse evento ocorre com mais frequência do que a função
				// updateGameState
				colliderPlayerWall(playerLeft, upperWall);
				colliderPlayerWall(playerLeft, lowerWall);

				io.emit('y-left', {
					roomName: room.name,
					value: playerLeft.position.y
				});
			}

			if (room.players.right == username) {
				playerRight.position.y = e.clientY;

				// A posição do jogador precisa ser corrigida aqui
				// porque esse evento ocorre com mais frequência do que a função
				// updateGameState
				colliderPlayerWall(playerRight, upperWall);
				colliderPlayerWall(playerRight, lowerWall);

				io.emit('y-right', {
					roomName: room.name,
					value: playerRight.position.y
				});
			}
		});

		startCoundDown();
	});
</script>

<h3>
{#if room.players.left == username}
	Jogador da Esquerda ({username})
{:else if room.players.right == username}
	Jobador da Direita : ({username})
{:else}
	Espectador
{/if}
</h3>
<br />
<canvas bind:this={canvas} {width} {height} />

<style>
	canvas {
		width: 400px;
		height: 300px;
		border: 1px solid #000000;
	}
</style>
