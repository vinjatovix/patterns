let playerState = "idle";
const dropDown = document.getElementById("animations");
dropDown.addEventListener("change", ({ target }) => {
  playerState = target.value;
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "../img/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

let gameFrame = 0;
const staggerFrames = 5;
const spriteAnimations = [];
const animationStates = [
  { name: "idle", frames: 7 },
  { name: "jump", frames: 7 },
  { name: "fall", frames: 7 },
  { name: "run", frames: 9 },
  { name: "dizzy", frames: 11 },
  { name: "sit", frames: 5 },
  { name: "roll", frames: 7 },
  { name: "bite", frames: 7 },
  { name: "ko", frames: 12 },
  { name: "getHit", frames: 4 }
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: []
  };
  for (let j = 0; j < state.frames; j++) {
    const positionX = j * spriteWidth;
    const positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});

const animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
  const frameX = spriteWidth * position;
  const frameY = spriteAnimations[playerState].loc[position].y;
  ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

  gameFrame++;
  requestAnimationFrame(animate);
};

animate();
