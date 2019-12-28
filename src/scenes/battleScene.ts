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

    private line1: Phaser.GameObjects.Line;
    private line2: Phaser.GameObjects.Line;
    private line3: Phaser.GameObjects.Line;

    private target: Phaser.GameObjects.Sprite;

    // Add 90 degrees because 0 our image is rotated wrong
    private readonly BASE_ROTATION = 90 * Math.PI / 180;

    private readonly THIRTY_DEGREES = 30 * Math.PI / 180;

    public preload() {
        this.load.image("dragon", "assets/dragon.png");
        this.load.image("square", "assets/square.png");
        this.load.image("goButton", "assets/btn1.png");
        this.load.image("target", "assets/target.png");
    }
    
    public create() {
        console.log('battle scene - radians');

        this.graphics = this.add.graphics();

        this.dragon = this.add.sprite(100, 100, "dragon");
        this.dragon.scale = 0.33;
        //this.dragon.angle = 90; // Use rotation for radians
        this.dragon.rotation = this.BASE_ROTATION;

        this.line1 = this.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line1.setOrigin(0, 0);

        this.line2 = this.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line2.setOrigin(0, 0);

        this.line3 = this.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line3.setOrigin(0, 0);

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

        this.target = this.add.sprite(350, 350, "target");

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

            this.updateFieldOfView();

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
        this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        
        this.updateFieldOfView();
    }

    private updateFieldOfView() {
        const from = this.dragon.getCenter();

        const left = this.findPointAtDistance(from, this.currentRotation - this.THIRTY_DEGREES, 450);
        this.line1.setTo(from.x, from.y, left.x, left.y);

        const right = this.findPointAtDistance(from, this.currentRotation + this.THIRTY_DEGREES, 450);
        this.line2.setTo(from.x, from.y, right.x, right.y);

        this.line3.setTo(left.x, left.y, right.x, right.y);

        const targetPos = this.target.getCenter();

        const isSeen = this.pointInTriangle(targetPos, from, left, right);
        console.log(`can see the target=${isSeen}`);
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

    // Check out Barycentric coordinate system for maybe a more efficient check?
    // Probably uneeded?
    // https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    // TODO: understand this
    private pointInTriangle(point: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): boolean {
        const d1 = this.findSign(point, v1, v2);
        const d2 = this.findSign(point, v2, v3);
        const d3 = this.findSign(point, v3, v1);

        const hasNegative = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const hasPositive = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(hasNegative && hasPositive);
    }
    
    // TODO: understand this
    private findSign(p1: Vector2, p2: Vector2, p3: Vector2): number {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
}