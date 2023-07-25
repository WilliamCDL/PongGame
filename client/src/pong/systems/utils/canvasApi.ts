
export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);

	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fill(); 
    ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, b: number){
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(a, b);
    ctx.stroke();
}