export function drawStatusText({ ctx, input, player }) {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`Status: ${input.lastKey}`, 10, 50);
  ctx.fillText(`State: ${player.currentState.state}`, 10, 100);
}
