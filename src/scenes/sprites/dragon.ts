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
    private lineLower: Phaser.GameObjects.Line;
    private lineUpper: Phaser.GameObjects.Line;
    private arc: Phaser.GameObjects.Arc;

    private path: Vector2[] = [];

    private battleScene: BattleScene;

    constructor(scene: BattleScene, initialPosition: Vector2, initalRotation: number) {
        this.battleScene = scene;

        this.dragon = scene.add.sprite(initialPosition.x, initialPosition.y, "dragon");
        this.dragon.scale = 0.33;
        this.currentRotation = initalRotation;
        this.dragon.rotation = this.BASE_ROTATION + initalRotation;

        this.lineLower = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000)
                .setOrigin(0, 0)
                .setAlpha(0.5);

        this.lineUpper = scene.add.line(0, 0, 0, 0, 0, 0, 0xFF0000)
                .setOrigin(0, 0)
                .setAlpha(0.5);

        this.arc = scene.add.arc()
                .setAlpha(0.5);
        this.arc.isStroked = true;
        this.arc.strokeColor = 0xFF0000;
        this.arc.closePath = false;

        this.square = scene.add.sprite(0, 0, "square");
        this.square.setInteractive();
        scene.input.setDraggable(this.square);

        scene.input.on('dragstart', (pointer, gameObject) => {
            console.log('Drag Start');
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            //FIX ME - how does this even work now??
            this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        });
    }

    public generatePath(numFrames: number) {
            this.path = this.curve.getPoints(numFrames);
            // this is a hack.  It drops the first point since it's where we are anyways
            // also getPoints returns numFrames + 1 points anyways
            this.path.shift(); 
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

        console.log(`Current=${this.vecToString(center)}, New=${this.vecToString(point)}, Angle=${angle}`)
        
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
        console.log(`Set target to: ${this.vecToString(targetPos)}`)
        this.square.setPosition(targetPos.x, targetPos.y);

        this.controlPoint = Core.findPointAtDistance(this.dragon.getCenter(), this.currentRotation, 150);
        this.curve = new Phaser.Curves.QuadraticBezier(this.dragon.getCenter(), this.controlPoint, this.square.getCenter());
        
        this.updateFieldOfView();
    }

    public updateFieldOfView() {
        const from = this.dragon.getCenter();

        const range = 450;

        const lowerAngle = this.currentRotation - Core.THIRTY_DEGREES;
        const lowerPoint = Core.findPointAtDistance(from, lowerAngle, range);
        this.lineLower.setTo(from.x, from.y, lowerPoint.x, lowerPoint.y);

        const upperAngle = this.currentRotation + Core.THIRTY_DEGREES;
        const upperPoint = Core.findPointAtDistance(from, upperAngle, 450);
        this.lineUpper.setTo(from.x, from.y, upperPoint.x, upperPoint.y);

        this.arc.setStartAngle(this.radToDeg(lowerAngle))
            .setRadius(range)
            .setEndAngle(this.radToDeg(upperAngle))
            .setPosition(from.x, from.y);
    }

    private radToDeg(radians: number): number {
        return radians * (180 / Math.PI);
    }

    private vecToString(vector: Vector2): string {
        return `(${vector.x},${vector.y})`
    }
}