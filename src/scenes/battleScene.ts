import * as Phaser from 'phaser';

type Vector2 = Phaser.Math.Vector2;

export class BattleScene extends Phaser.Scene {

    private goButton: Phaser.GameObjects.Sprite;

    private dragon: Phaser.GameObjects.Sprite;
    private currentRotation = 0; 

    private graphics: Phaser.GameObjects.Graphics;
    private square: Phaser.GameObjects.Sprite;

    private curve: Phaser.Curves.QuadraticBezier;
    private controlPoint: Phaser.Math.Vector2;
    private path: Vector2[] = [];

    // Add 90 degrees because 0 our image is rotated wrong
    private readonly BASE_ROTATION = 90 * Math.PI / 180;

    public preload() {
        this.load.image("dragon", "assets/dragon.png");
        this.load.image("square", "assets/square.png");
        this.load.image("goButton", "assets/btn1.png");
    }
    
    public create() {
        console.log('battle scene - radians');

        this.graphics = this.add.graphics();

        this.dragon = this.add.sprite(100, 100, "dragon");
        this.dragon.scale = 0.33;
        //this.dragon.angle = 90; // Use rotation for radians
        this.dragon.rotation = this.BASE_ROTATION;

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

            let center = this.dragon.getCenter();
            let angle = this.angleBetween(center, point);

            //console.log(`center=${center.x},${center.y} point=${point.x},${point.y} angle=${angle}`);
            
            this.dragon.setPosition(point.x, point.y);
            this.dragon.rotation = angle + this.BASE_ROTATION;
            this.currentRotation = angle;

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

        const targetPos = this.findPointAtDistance(this.dragon.getCenter(), this.currentRotation, 300);
        this.square.setPosition(targetPos.x, targetPos.y);

        this.controlPoint = this.findPointAtDistance(this.dragon.getCenter(), this.currentRotation, 150);
        this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(),
                this.controlPoint, this.square.getCenter());
    }

    private toggleOff() {
        this.goButton.setVisible(false);
    }

    private findPointAtDistance(basePoint: Vector2, angle: number, distance: number): Vector2 {
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return new Phaser.Math.Vector2(basePoint.x + x, basePoint.y + y);
    }

    private angleBetween(a: Vector2, b: Vector2): number {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
}