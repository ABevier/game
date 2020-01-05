import * as Phaser from 'phaser';
import { Dragon } from './sprites/dragon';

type Vector2 = Phaser.Math.Vector2;

export class BattleScene extends Phaser.Scene {

    private goButton: Phaser.GameObjects.Sprite;

    private dragon1: Dragon;
    private dragon2: Dragon;

    private graphics: Phaser.GameObjects.Graphics;

    private keyUp: Phaser.Input.Keyboard.Key;
    private keyDown: Phaser.Input.Keyboard.Key;
    private keyLeft: Phaser.Input.Keyboard.Key;
    private keyRight: Phaser.Input.Keyboard.Key;

    private frameCount = 0;

    public preload() {
        this.load.image("spear", "assets/spear.png")
        this.load.image("dragon", "assets/dragon.png");
        this.load.image("square", "assets/square.png");
        this.load.image("goButton", "assets/btn1.png");
    }
    
    public create() {
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.graphics = this.add.graphics();

        this.dragon1 = new Dragon(this, new Phaser.Math.Vector2(100, 200), 0);
        this.dragon2 = new Dragon(this, new Phaser.Math.Vector2(800, 200), Math.PI);

        this.goButton = this.add.sprite(100, 480, "goButton");
        this.goButton.setScale(2, 2);
        this.goButton.setInteractive();
        this.goButton.setScrollFactor(0);

        this.goButton.on('pointerdown', () => {
            console.log("go button clicked");
            this.dragon1.generatePath(60);
            this.dragon2.generatePath(60);
            this.frameCount = 60;
            this.toggleOff();
        });

        this.toggleOn();
    }

    public update() {
        if (this.keyUp.isDown) {
            this.cameras.main.scrollY -= 5;
        }

        if (this.keyDown.isDown) {
            this.cameras.main.scrollY += 5;
        }

        if (this.keyLeft.isDown) {
            this.cameras.main.scrollX -= 5;
        }

        if (this.keyRight.isDown) {
            this.cameras.main.scrollX += 5;
        }

        this.graphics.clear();

        if (this.frameCount > 0) {
            this.dragon1.update(this.dragon2);
            this.dragon2.update(this.dragon1); 
     
            this.frameCount--;
            if (this.frameCount <= 0) {
                this.toggleOn();
            }
        } else {
            this.dragon1.updateIdle(this.graphics);
            this.dragon2.updateIdle(this.graphics);
        }
    }

    private toggleOn() {
        this.dragon1.setToIdleMode();
        this.dragon2.setToIdleMode();
        this.goButton.setVisible(true);
    }

    private toggleOff() {
        this.goButton.setVisible(false);
    }
}