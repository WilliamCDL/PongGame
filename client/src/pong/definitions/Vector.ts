export interface Vector {
    x: number;
    y: number;
}

export class Vector2D {
    constructor(public x: number, public y: number){}
}

export function add(a: Vector2D, b: Vector2D): Vector2D{
    return new Vector2D(a.x + b.x, a.y+b.y);
}

export function sub(a: Vector2D, b: Vector2D): Vector2D{
    return new Vector2D(a.x - b.x, a.y - b.y);
}

export function mult(a: Vector2D, b: Vector2D): Vector2D{
    return new Vector2D(a.x * b.x, a.y * b.y);
}

export function dot(a: Vector2D, b: Vector2D): number{
    return a.x * b.x + a.y * b.y;
}

export function size(a: Vector2D){
    return Math.sqrt(dot(a, a));
}

export function resize(a: Vector2D, b: number): Vector2D{
    return new Vector2D(a.x * b, a.y * b);
}

export function normilised(a: Vector2D): Vector2D {
    const b = size(a);
    return new Vector2D(a.x / b, a.y / b);
}