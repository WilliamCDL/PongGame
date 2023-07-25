import type { Block } from "../../definitions/Block";
import type { Score } from "../../definitions/Score";

export function drawBlock(ctx: CanvasRenderingContext2D, block: Block) {
    ctx.fillRect(
        block.position.x - block.width / 2,
        block.position.y - block.height / 2,
        block.width,
        block.height
    );
}

export function displayTimer(ctx: CanvasRenderingContext2D, timer: number){
    ctx.font = "36px Arial";
    ctx.fillText(""+timer, ctx.canvas.width / 2 - 10, (ctx.canvas.height / 2) - 50 );
}

export function displayScore(ctx: CanvasRenderingContext2D, score: Score){
    ctx.font = "36px Arial";
    ctx.fillText(""+score.left, (ctx.canvas.width / 2) - 100 -10, 40);
    ctx.fillText(""+score.right,(ctx.canvas.width / 2) + 100 -10, 40);
}

const titleFont = "bold 40px Arial";
const subTitleFont = "300 24px Arial";

const titleX = (ctx: CanvasRenderingContext2D) => (ctx.canvas.width / 2) - 62.5
const titleY = (ctx: CanvasRenderingContext2D) => (ctx.canvas.height / 2) - 25

const subTitleX = (ctx: CanvasRenderingContext2D) => (ctx.canvas.width / 2) - 87.5
const subTitleY = (ctx: CanvasRenderingContext2D) => (ctx.canvas.height / 2) + 25

export function displayVictoryLeft(ctx: CanvasRenderingContext2D, currentPlayerIsRight: boolean){
    ctx.font = titleFont;
    if(!currentPlayerIsRight)
        ctx.fillText("Victory", titleX(ctx), titleY(ctx));
    else
        ctx.fillText("Defeated", titleX(ctx), titleY(ctx));

    ctx.font = subTitleFont;
    ctx.fillText("Player Left Wins", subTitleX(ctx), subTitleY(ctx));
}

export function displayVictoryRight(ctx: CanvasRenderingContext2D, currentPlayerIsLeft: boolean){
    ctx.font = titleFont;
    if(!currentPlayerIsLeft)
        ctx.fillText("Victory", titleX(ctx), titleY(ctx));
    else
        ctx.fillText("Defeated", titleX(ctx)-12.5, titleY(ctx));
    
    ctx.font = subTitleFont;
    ctx.fillText("Player Right Wins", subTitleX(ctx), subTitleY(ctx));
}

