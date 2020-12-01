
export class MainScene extends Phaser.Scene {

    private text: Phaser.GameObjects.Text;
    private posText: Phaser.GameObjects.Text;

    public preload() {
        console.log("preload main scene");
        this.load.image("hex", "assets/grassHex.png")
    }


    public create() {
        console.log("create main scene");

        //this.cameras.main.setZoom(0.5);

        this.text = this.add.text(10, 10, "pixel");
        this.posText = this.add.text(10, 25, "coord");

        let startX = 100;
        let startY = 100;

        // 18 36 54 72

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 12; x++) {
                let posX = startX + (x * 54);
                let posY = startY + (y * 72);

                if (x % 2 !== 0) {
                    posY += 36; // shift down half a "tile"
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
        const pX = this.game.input.mousePointer.worldX;
        const pY = this.game.input.mousePointer.worldY;

        this.text.text = `pixel x: ${pX} y: ${pY}`;

        this.magicFunction(pX - 100, pY - 100);
    }

    //TODO: this really is magic...
    private magicFunction(worldX: number, worldY: number) {

        const hexSize = 72;
        const tilingWidth = Math.floor(hexSize * 3 / 2);
        const tilingHeight = hexSize;

        // I'm not going to pretend to know why the rest of this works.
        let coordX = Math.floor(worldX / tilingWidth) * 2;
        const xMod = Math.floor(worldX % tilingWidth);

        let coordY = Math.floor(worldY / tilingHeight);
        const yMod = Math.floor(worldY % tilingHeight);

        console.log(`xmod:${xMod} ymod:${yMod} hx:${coordX} hy:${coordY} tilingWidth: ${tilingWidth}`);

        if (yMod < tilingHeight / 2) {
            //Top half of the "tile"
            if ((xMod * 2 + yMod) < (hexSize / 2)) {
                //It's to the left
                coordX--;
                coordY--;
                
            }
            else if ((xMod * 2 - yMod) < tilingWidth) {
                // do nothing - it's in the main hex
            }
            else {
                //it's to the right
                coordX++;
                coordY--;
            }
        }
        else {
            //bottom half of the "tile"
            if ((xMod * 2 - (yMod - hexSize / 2)) < 0) {
                // It's to the left
                coordX--;
            }
            else if ((xMod * 2 + (yMod - hexSize / 2)) < hexSize * 2) {
                // do nothing - it's in the main hex
            }
            else {
                // It's to the rigth
                coordX++;
            }
        }

        this.posText.text = `coord x: ${coordX} y: ${coordY}`;
    }
}