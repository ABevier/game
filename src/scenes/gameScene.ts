import { sum } from "../engine/foo";
import { StateManager, MainState } from "./battle/states";

export class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GameScene",
            active: false,
            visible: false
        })
    }

    private stateManager: StateManager = new StateManager();
    private characters: DCharacter[] = [];

    public create() {
        const result = sum(1, 2, 3);
        console.log(`The result is: ${result}`);

        this.characters.push(new DCharacter(this, "Hero1", 100, 400, false));
        this.characters.push(new DCharacter(this, "Hero2", 375, 400, false));
        this.characters.push(new DCharacter(this, "Hero3", 650, 400, false));

        this.characters.push(new DCharacter(this, "Goblin1", 250, 100, true));
        this.characters.push(new DCharacter(this, "Goblin2", 525, 100, true));

        this.stateManager.nextState(new MainState(this.stateManager, this.characters));
    }


    public update() {
        //TODO
    }
}

export class DCharacter {
    private readonly background: Phaser.GameObjects.Rectangle;

    public constructor(scene: Phaser.Scene, name: string, x: number, y: number, badGuy: boolean) {
        const container = scene.add.container(x, y);

        const color = badGuy ? 0xFF0000 : 0x0000FF;

        this.background = scene.add.rectangle(0, 0, 250, 100, color);
        this.background.setOrigin(0, 0);
        this.background.setInteractive();
        this.background.on('pointerdown', () => {
            console.log(`Clicked on ${name}`);
            this.activate();
        });
        container.add(this.background);

        const txt = scene.add.text(5, 5, name);
        txt.setOrigin(0, 0);
        container.add(txt);

        const hp = scene.add.text(5, 20, "HP: 100/100");
        hp.setOrigin(0, 0);
        container.add(hp);
    }

    public activate(): void {
        this.background.fillColor = 0x00FF00;
    }
}