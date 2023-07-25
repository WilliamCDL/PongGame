import type { Vector } from "./Vector";

export interface Block {
	width: number;
	height: number;
    position: Vector;
	onCollision?: any
}

export class GameBlock implements Block {
	constructor(public position: Vector, public width: number, public height: number, public onCollision: any) {}
}
