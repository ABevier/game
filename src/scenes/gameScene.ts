import { sum } from "../engine/foo";

export class GameScene extends Phaser.Scene {

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

        this.makeContainer(100, 400);

        this.makeContainer(375, 400);

        this.makeContainer(650, 400);
    }

    private makeContainer(x: number, y: number): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        const bground = this.add.rectangle(0, 0, 250, 100, 0x0000FF);
        bground.setOrigin(0, 0);
        container.add(bground);

        const txt = this.add.text(5, 5, "Hero");
        txt.setOrigin(0, 0);
        container.add(txt);

        const hp = this.add.text(5, 20, "HP: 100/100");
        hp.setOrigin(0, 0);
        container.add(hp);

        return container;
    }

    public update() {
        //TODO
    }
}