import * as Phaser from 'phaser';
import { BattleScene } from './scenes/battleScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: window.innerWidth,
  height: window.innerHeight,
 
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
 
  parent: 'game',
  backgroundColor: '#000000',
  scene: BattleScene
};
 
export const game = new Phaser.Game(gameConfig);
