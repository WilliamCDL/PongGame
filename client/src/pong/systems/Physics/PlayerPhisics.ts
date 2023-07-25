import type { Block } from "../../definitions/Block";
import type { Ball } from "../../definitions/Ball";
import { size, normilised, sub, resize, Vector2D, dot } from "../../definitions/Vector";

export const playerCollision = (block: Block, ball: Ball) => {
    // Mudar a direção da bola baseado na posição que ela bate na raquete.
    let length = size(ball.velocity);
    
    const baixo = new Vector2D(0, 1);

    let direction = normilised(sub(ball.position, block.position));

    if(direction.y < -0.8) {
        direction.y = -0.8; 
    }
    if(direction.y > 0.8) {
        direction.y = 0.8;
    }
    console.log(direction)
    direction.x = Math.sqrt(1 - (direction.y * direction.y));

    if(ball.position.x < block.position.x) {
        direction.x *= -1;
    }

    ball.velocity = resize(direction, length);
}

export function colliderPlayerWall(player: Block, wall: Block) {
	// Detect colision
	
	// top
	if (player.position.y + player.height / 2 < wall.position.y - wall.height / 2) {
		return;
	}

	// bottom
	if (player.position.y - player.height / 2 > wall.position.y + wall.height / 2) {
		return;
	}

    if(player.position.y < wall.position.y) {
        player.position.y = wall.position.y - (wall.height / 2) - (player.height / 2)
    }
    if(player.position.y > wall.position.y) {
        player.position.y = wall.position.y + (wall.height / 2) + (player.height / 2)
    }
}