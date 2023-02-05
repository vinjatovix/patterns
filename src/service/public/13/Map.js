import { Boundary } from "../common/sprites/Boundary.js";

export class Map {
  constructor({ image, controls, x = 0, y = 0, offset = { x: 0, y: 0 }, boundaries, foreground, battleZones }) {
    this.image = image;
    this.foreground = foreground;
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.controls = controls;
    this.boundaries = [];
    this.battleZones = [];
    this.tileOffset = offset;
    this.#setBoundaries(boundaries, this.boundaries, this.tileOffset);
    this.#setBoundaries(battleZones, this.battleZones, this.tileOffset);
    this.battle = true;
  }

  #setBoundaries({ data, width }, type, offset) {
    const rows = [];

    for (let i = 0; i < data.length; i += width) {
      rows.push(data.slice(i, i + width));
    }

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        if (rows[i][j]) {
          type.push(
            new Boundary({
              x: (j + offset.x) * Boundary.width,
              y: (i + offset.y) * Boundary.height
            })
          );
        }
      }
    }
  }

  #getCollisions(player, tiles = []) {
    return tiles.reduce((acc, tile) => {
      const { top, bottom, left, right } = tile.detectCollision(player);

      return {
        top: acc.top || top,
        bottom: acc.bottom || bottom,
        left: acc.left || left,
        right: acc.right || right
      };
    }, {});
  }

  #checkBattleZone(player) {
    const isAble = this.battleZones.some(tile => tile.detectMinimumAreaOverlap(player));
    const coin = Math.random() < 0.005;
    if (isAble && coin) {
      this.battle = true;
    }
  }

  #getMovability(collisions) {
    return {
      up: !collisions.top && this.controls.up && this.controls.lastDirection === "up",
      down: !collisions.bottom && this.controls.down && this.controls.lastDirection === "down",
      left: !collisions.left && this.controls.left && this.controls.lastDirection === "left",
      right: !collisions.right && this.controls.right && this.controls.lastDirection === "right"
    };
  }

  #updatePosition(player) {
    const collisions = this.#getCollisions(player, this.boundaries);
    const movability = this.#getMovability(collisions);

    if (collisions.bottom || movability.up) this.y += this.speed;
    if (collisions.top || movability.down) this.y -= this.speed;
    if (collisions.right || movability.left) this.x += this.speed;
    if (collisions.left || movability.right) this.x -= this.speed;

    this.boundaries.forEach(boundary => boundary.update({ collisions, movability, speed: this.speed }));

    this.battleZones.forEach(boundary => {
      boundary.update({ collisions, movability, speed: this.speed });
    });
  }

  update(player) {
    if (!this.battle) {
      this.#updatePosition(player);
      this.#checkBattleZone(player);
    }
  }

  #debug(ctx) {
    this.boundaries.forEach(boundary => boundary.draw(ctx));
    this.battleZones.forEach(boundary => boundary.draw(ctx));
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
    this.controls.debug && this.#debug(ctx);
  }

  drawForeground(ctx) {
    ctx.drawImage(this.foreground, this.x, this.y);
  }
}
