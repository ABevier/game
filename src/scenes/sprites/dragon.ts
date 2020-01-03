import * as Core from '../../core/core';
import { BattleScene } from '../battleScene';

type Vector2 = Phaser.Math.Vector2;

export class Dragon {

    // Add 90 degrees because 0 our image is rotated wrong
    private readonly BASE_ROTATION = 90 * Math.PI / 180;

    private currentRotation = 0; 
    private attackTimer = 0;

    private dragon: Phaser.GameObjects.Sprite;

    // For the path
    private square: Phaser.GameObjects.Sprite;
    private curve: Phaser.Curves.QuadraticBezier;
    private controlPoint: Phaser.Math.Vector2;

    // Debug lines
    private line1: Phaser.GameObjects.Line;
    private line2: Phaser.GameObjects.Line;
    private line3: Phaser.GameObjects.Line;
    private line4: Phaser.GameObjects.Line;

    private path: Vector2[] = [];

    private battleScene: BattleScene;

    constructor(scene: BattleScene) {
        this.battleScene = scene;

        this.dragon = scene.add.sprite(100, 100, "dragon");
        this.dragon.scale = 0.33;
        this.dragon.rotation = this.BASE_ROTATION;

        this.line1 = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line1.setOrigin(0, 0);

        this.line2 = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line2.setOrigin(0, 0);

        this.line3 = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line3.setOrigin(0, 0);

        this.line4 = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000);
        this.line4.setOrigin(0, 0);

        this.square = scene.add.sprite(0, 0, "square");
        this.square.setInteractive();
        scene.input.setDraggable(this.square);

        scene.input.on('dragstart', (pointer, gameObject) => {
            console.log('Drag Start');
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        });
    }

    public generatePath(numFrames: number) {
            this.path = this.curve.getPoints(numFrames - 1);
            console.log(`len = ${this.path.length}`);
    }

    public updateIdle(graphics: Phaser.GameObjects.Graphics) {
        graphics.lineStyle(1, 0xFF00FF, 1);
        this.curve.draw(graphics);
    }

    public update(target: Phaser.GameObjects.Sprite) {
        let point = this.path.shift();

        let center = this.dragon.getCenter();
        let angle = Core.angleBetween(center, point);
        
        this.dragon.setPosition(point.x, point.y);
        this.currentRotation = angle;
        this.dragon.rotation = angle + this.BASE_ROTATION;

        if (this.attackTimer > 0) {
            this.attackTimer--;
        } else {
            this.checkTarget(target);
        }

        this.updateFieldOfView();
    }

    private checkTarget(target: Phaser.GameObjects.Sprite) {
        const from = this.dragon.getCenter();
        const left = Core.findPointAtDistance(from, this.currentRotation - Core.THIRTY_DEGREES, 450);
        const right = Core.findPointAtDistance(from, this.currentRotation + Core.THIRTY_DEGREES, 450);

        const targetPos = target.getCenter();

        const isSeen = Core.pointInTriangle(targetPos, from, left, right);
        if (isSeen && this.attackTimer <= 0)  {
            console.log(`Auto Attack on target at:(${targetPos.x},${targetPos.y}), 
                    from:(${from.x},${from.y}) with rotation:${this.currentRotation}`);
            this.createAutoAttack(from, targetPos, target);
            this.attackTimer = 30;
        }
    }

    private createAutoAttack(start: Vector2, end: Vector2, target: Phaser.GameObjects.Sprite) {
        const spear = this.battleScene.add.image(start.x, start.y, "spear");

        let rotation = Core.angleBetween(start, end);
        spear.rotation = rotation;

        // Probably don't want a tween...
        this.battleScene.tweens.add({
            targets: spear,
            x: end.x,
            y: end.y,
            duration: 500,
            onComplete: () => {
                spear.destroy() 
                if (target.active) {
                    target.destroy();
                    this.battleScene.spawnTarget();
                }
            }
        });
    }

    public setToIdleMode() {
        const targetPos = Core.findPointAtDistance(this.dragon.getCenter(), this.currentRotation, 300);
        this.square.setPosition(targetPos.x, targetPos.y);

        this.controlPoint = Core.findPointAtDistance(this.dragon.getCenter(), this.currentRotation, 150);
        this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        
        this.updateFieldOfView();
    }

    public updateFieldOfView() {
        const from = this.dragon.getCenter();

        const left = Core.findPointAtDistance(from, this.currentRotation - Core.THIRTY_DEGREES, 450);
        this.line1.setTo(from.x, from.y, left.x, left.y);

        const right = Core.findPointAtDistance(from, this.currentRotation + Core.THIRTY_DEGREES, 450);
        this.line2.setTo(from.x, from.y, right.x, right.y);

        this.line3.setTo(left.x, left.y, right.x, right.y);

        //const straight = this.findPointAtDistance(from, this.currentRotation, 450);
        //this.line4.setTo(from.x, from.y, straight.x, straight.y);
    }
}