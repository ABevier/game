import * as Phaser from 'phaser';
import { Dragon } from './sprites/dragon';

type Vector2 = Phaser.Math.Vector2;

export class BattleScene extends Phaser.Scene {

    private goButton: Phaser.GameObjects.Sprite;

    private dragon: Dragon;

    private graphics: Phaser.GameObjects.Graphics;

    private target: Phaser.GameObjects.Sprite;

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
        this.load.image("target", "assets/target.png");
    }
    
    public create() {
        console.log('battle scene - radians');

        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.graphics = this.add.graphics();

        this.dragon = new Dragon(this);

        this.goButton = this.add.sprite(600, 450, "goButton");
        this.goButton.setInteractive();
        this.goButton.setScrollFactor(0);

        this.goButton.on('pointerdown', () => {
            console.log("go button clicked");
            this.dragon.generatePath(60);
            this.frameCount = 60;
            this.toggleOff();
        });

        this.spawnTarget();

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
            this.dragon.update(this.target);

            this.frameCount--;
            if (this.frameCount <= 0) {
                this.toggleOn();
            }
        } else {
            this.dragon.updateIdle(this.graphics);
        }
    }

    private toggleOn() {
        this.dragon.setToIdleMode();
        this.goButton.setVisible(true);
    }

    public spawnTarget() {
        const x = Math.random() * 500;
        const y = Math.random() * 500;

        this.target = this.add.sprite(x, y, "target");
    }

    private toggleOff() {
        this.goButton.setVisible(false);
    }
}