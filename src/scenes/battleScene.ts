import * as Phaser from 'phaser';
import { Dragon } from './sprites/dragon';
import { AutoAttack} from './sprites/autoAttack';

type Vector2 = Phaser.Math.Vector2;

export class BattleScene extends Phaser.Scene {

    private goButton: Phaser.GameObjects.Sprite;
    
    private debugButton: Phaser.GameObjects.Sprite;
    public debugMode = false;

    private dragonTeamA: Dragon[];
    private dragonTeamB: Dragon[];
    private allDragons: Dragon[];

    private autoAttacks: AutoAttack[] = [];

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

        this.dragonTeamA = [
            new Dragon(this, "a1", new Phaser.Math.Vector2(100, 150), 0),
            new Dragon(this, "a2", new Phaser.Math.Vector2(150, 200), 0),
            new Dragon(this, "a3", new Phaser.Math.Vector2(100, 250), 0)
        ];

        this.dragonTeamB = [
            new Dragon(this, "b1", new Phaser.Math.Vector2(1000, 150), Math.PI),
            new Dragon(this, "b2", new Phaser.Math.Vector2(950, 200), Math.PI),
            new Dragon(this, "b3", new Phaser.Math.Vector2(1000, 250), Math.PI)
        ];

        this.allDragons = [...this.dragonTeamA, ...this.dragonTeamB];

        this.goButton = this.add.sprite(100, 480, "goButton");
        this.goButton.setScale(2, 2);
        this.goButton.setInteractive();
        this.goButton.setScrollFactor(0);

        this.goButton.on('pointerdown', () => {
            console.log("go button clicked");
            this.frameCount = 60;
            this.allDragons.forEach(dragon => dragon.generatePath(this.frameCount));
            this.toggleOff();
        });

        this.debugButton = this.add.sprite(1000, 480, "goButton")
            .setScale(2, 2)
            .setInteractive()
            .setScrollFactor(0);

        const toggleDebugFn = () => {
            this.allDragons.forEach(dragon => dragon.toggleDebug(this.debugMode));
        };

        this.debugButton.on('pointerdown', () => {
            this.debugMode = !this.debugMode;
            toggleDebugFn();
        });

        toggleDebugFn();

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
            this.dragonTeamA.forEach(dragon => dragon.update(this.dragonTeamB));
            this.dragonTeamB.forEach(dragon => dragon.update(this.dragonTeamA));

            this.autoAttacks.forEach(attack => attack.update());
     
            this.frameCount--;
            if (this.frameCount <= 0) {
                this.toggleOn();
            }
        } else {
            this.allDragons.forEach(dragon => dragon.updateIdle(this.graphics));
        }
    }

    private toggleOn() {
        this.allDragons.forEach(dragon => dragon.setToIdleMode());
        this.goButton.setVisible(true);
    }

    private toggleOff() {
        this.goButton.setVisible(false);
    }

    public addAutoAttack(source: Dragon, target: Dragon) {
        const from = source.getCenter();
        const attack = new AutoAttack(this, target, from.x, from.y);
        this.autoAttacks.push(attack);
    }

    public destroyAutoAttack(attack: AutoAttack) {
        //TODO: this is probably gross?
        const idx = this.autoAttacks.indexOf(attack);
        if (idx >= 0) {
            console.log("remove auto attack");
            this.autoAttacks.splice(idx, 1);
        }
    }
}