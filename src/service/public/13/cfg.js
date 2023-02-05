import { boundariesOutDoor } from "./mapsData/boundariesOutDoor.js";
import { battlegroundOutDoor1 } from "./mapsData/battlegroundOutDoor1.js";

const map1 = new Image();
map1.src = "../../img/OutdoorMap1.png";

const map1Foreground = new Image();
map1Foreground.src = "../../img/OutdoorMap1Foreground.png";

export const maps = Object.freeze({
  outdoor1: {
    image: map1,
    foreground: map1Foreground,
    x: -150,
    y: -120,
    offset: { x: -3.1, y: -2.5 },
    boundaries: boundariesOutDoor,
    battleZones: battlegroundOutDoor1
  }
});

const playerUpImage = new Image();
playerUpImage.src = "../../img/playerUp.png";

const playerDownImage = new Image();
playerDownImage.src = "../../img/playerDown.png";

const playerLeftImage = new Image();
playerLeftImage.src = "../../img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "../../img/playerRight.png";

const playerSpritesCfg = {
  width: 48,
  height: 68,
  maxFrameX: 3,
  fps: 8
};

export const playerStates = {
  up: { image: playerUpImage, ...playerSpritesCfg },
  down: { image: playerDownImage, ...playerSpritesCfg },
  left: { image: playerLeftImage, ...playerSpritesCfg },
  right: { image: playerRightImage, ...playerSpritesCfg }
};
