import type { Ball } from '../../definitions/Ball';
import type { Block } from '../../definitions/Block';
import { add } from '../../definitions/Vector';

export function colliderBallPlayer(ball: Ball, block: Block) {
	// Detect colision
	// left
	if (ball.position.x + ball.r < block.position.x - block.width / 2) {
		return;
	}

	// right
	if (ball.position.x - ball.r > block.position.x + block.width / 2) {
		return;
	}

	// top
	if (ball.position.y + ball.r < block.position.y - block.height / 2) {
		return;
	}

	// down
	if (ball.position.y - ball.r > block.position.y + block.height / 2) {
		return;
	}

	// Update ball velocity
	if (block.onCollision) block.onCollision(block, ball);
}

export function ballPhisics(ball: Ball) {
	// Modificar posição baseado na velocidade da bola
	ball.position = add(ball.position, ball.velocity);
}
