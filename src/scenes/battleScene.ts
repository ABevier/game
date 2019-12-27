import * as Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {

    private goButton: Phaser.GameObjects.Sprite;

    private dragon: Phaser.GameObjects.Sprite;

    private graphics: Phaser.GameObjects.Graphics;
    private square: Phaser.GameObjects.Sprite;

    private curve: Phaser.Curves.QuadraticBezier;
    private controlPoint: Phaser.Math.Vector2;
    private path: Phaser.Math.Vector2[] = [];

    public preload() {
        this.load.image("dragon", "assets/dragon.png");
        this.load.image("square", "assets/square.png");
        this.load.image("goButton", "assets/btn1.png");
    }
    
    public create() {
        console.log('battle scene');

        this.graphics = this.add.graphics();

        this.dragon = this.add.sprite(100, 100, "dragon");
        this.dragon.scale = 0.33;
        this.dragon.angle = 90; // Use rotation for radians

        this.square = this.add.sprite(0, 0, "square");
        this.square.setInteractive();
        this.input.setDraggable(this.square);

        this.input.on('dragstart', (pointer, gameObject) => {
            console.log('Drag Start');
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        });

        this.goButton = this.add.sprite(600, 450, "goButton");
        this.goButton.setInteractive();

        this.goButton.on('pointerdown', () => {
            console.log("go button clicked");
            this.path = this.curve.getPoints(30);
            console.log(`len = ${this.path.length}`);
            this.toggleOff();
        });

        this.toggleOn();
    }

    public update() {
        this.graphics.clear();

        if (this.path.length > 0) {
            let point = this.path.shift();
            this.dragon.setPosition(point.x, point.y);
            if (this.path.length == 0) {
                this.toggleOn();
            }
        } else {
            this.graphics.lineStyle(1, 0xFF00FF, 1);
            this.curve.draw(this.graphics);
        }
    }

    private toggleOn() {
        this.goButton.setVisible(true);

        this.square.setPosition(this.dragon.x + 300, this.dragon.y);

        this.controlPoint = new Phaser.Math.Vector2(this.dragon.x + 150, this.dragon.y);
        this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(),
                this.controlPoint, this.square.getCenter());
    }

    private toggleOff() {
        this.goButton.setVisible(false);
    }
}