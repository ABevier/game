import * as Phaser from "phaser";
import { MainScene } from "./v2/MainScene";
import { SetupScene } from "./v2/setupScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",

  type: Phaser.AUTO,

  width: window.innerWidth,
  height: window.innerHeight,

  render: {
    antialias: false,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  parent: "game",
  backgroundColor: "#000000",
  scene: [SetupScene, MainScene],
};

export const game = new Phaser.Game(gameConfig);
