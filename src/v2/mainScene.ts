
export class MainScene extends Phaser.Scene {

    private text: Phaser.GameObjects.Text;
    private posText: Phaser.GameObjects.Text;

    public preload() {
        console.log("preload main scene");
        this.load.image("hex", "assets/hex.png")
    }


    public create() {
        console.log("create main scene");

        this.text = this.add.text(10, 10, "pixel");
        this.posText = this.add.text(10, 25, "coord");

        let startX = 100;
        let startY = 100;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 10; x++) {
                let posX = startX + (x * 25);
                let posY = startY + (y * 32);

                if (x % 2 !== 0) {
                    posY += 16; // shift down half a "tile"
                }

                this.add.sprite(posX, posY, "hex")
                    .setOrigin(0, 0);
            }
        }

        // this.add.sprite(100, 100, "hex")
        //     .setOrigin(0, 0);

        // this.add.sprite(125, 116, "hex")
        //     .setOrigin(0, 0);

        // this.add.sprite(150, 100, "hex")
        //     .setOrigin(0, 0);

        // this.add.sprite(100, 132, "hex")
        //     .setOrigin(0, 0);
    }

    public update() {
        const pX = this.game.input.mousePointer.x;
        const pY = this.game.input.mousePointer.y;

        this.text.text = `pixel x: ${pX} y: ${pY}`;

        this.posText.text = `coord x: ? y: ?`;
    }
}