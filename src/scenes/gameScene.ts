import { sum } from "../engine/foo";

export class GameScene extends Phaser.Scene {

    private square: Phaser.GameObjects.Rectangle & {body: Phaser.Physics.Arcade.Body}

    constructor() {
        super({
            key: "GameScene",
            active: false,
            visible: false
        })
    }

    public create() {
        const result = sum(1, 2, 3);
        console.log(`The result is: ${result}`);

        this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
        this.physics.add.existing(this.square);
    }

    public update() {
        //TODO
    }
}