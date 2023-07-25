import type { Block } from "../../definitions/Block";
import type { Ball } from "../../definitions/Ball";



export const wallCollition = (block: Block, ball: Ball) => {
	// Tira a bola de dentro do bloco
	if (ball.position.y > block.position.y) {
		ball.position.y = block.position.y + block.height / 2 + ball.r + 0.01;
	}
	
	if (ball.position.y < block.position.y) {
		ball.position.y = block.position.y - block.height / 2 - ball.r - 0.01;
	}

	// Troca a velicidade da bola
	ball.velocity.y *= -1;
}


export function colliderBallWall(ball: Ball, block: Block) {
	// top
	if (ball.position.y + ball.r < block.position.y - block.height / 2) {
		return;
	}

	// bottom
	if (ball.position.y - ball.r > block.position.y + block.height / 2) {
		return;
	}

	// Update ball velocity
	if (block.onCollision) block.onCollision(block, ball);
}

