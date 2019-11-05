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

        this.makeContainer("Hero1", 100, 400, false);
        this.makeContainer("Hero2", 375, 400, false);
        this.makeContainer("Hero3", 650, 400, false);

        this.makeContainer("Goblin1", 250, 100, true);
        this.makeContainer("Goblin2", 525, 100, true);
    }

    private makeContainer(name: string, x: number, y: number, badGuy: boolean): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        const color = badGuy ? 0xFF0000 : 0x0000FF;

        const bground = this.add.rectangle(0, 0, 250, 100, color);
        bground.setOrigin(0, 0);
        bground.setInteractive();
        bground.on('pointerdown', () => console.log(`Clicked on ${name}`));
        
        container.add(bground);

        const txt = this.add.text(5, 5, name);
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