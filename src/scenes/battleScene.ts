import * as Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {

    private graphics: Phaser.GameObjects.Graphics;
    private square: Phaser.GameObjects.Sprite;

    private curve: Phaser.Curves.QuadraticBezier;

    public preload() {
        this.load.image("dragon", "assets/dragon.png");
        this.load.image("square", "assets/square.png");
    }
    
    public create() {
        console.log('battle scene');

        this.graphics = this.add.graphics();

        var dragon = this.add.sprite(100, 100, "dragon");
        dragon.scale = 0.33;
        dragon.angle = 90; // Use rotation for radians

        this.square = this.add.sprite(400, 100, "square");
        this.square.setInteractive();

        this.input.setDraggable(this.square);
        
        this.input.on('dragstart', (pointer, gameObject) => {
            console.log('Drag Start');
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.curve = new Phaser.Curves.QuadraticBezier(dragon.getCenter(), cp, this.square.getCenter());
        });

        let cp = new Phaser.Math.Vector2(250, 100);
        this.curve = new Phaser.Curves.QuadraticBezier(dragon.getCenter(), cp, this.square.getCenter());
    }

    public update() {
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xFF00FF, 1);
        this.curve.draw(this.graphics);
    }
}