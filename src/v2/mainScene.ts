
export class MainScene extends Phaser.Scene {

    private text: Phaser.GameObjects.Text;
    private posText: Phaser.GameObjects.Text;
    private posText2: Phaser.GameObjects.Text;

    public preload() {
        console.log("preload main scene");
        //this.load.image("hex", "assets/grassHex.png")
        this.load.image("hex", "assets/hex.png")
    }


    public create() {
        console.log("create main scene");

        this.text = this.add.text(10, 10, "pixel");
        this.posText = this.add.text(10, 25, "coord");
        this.posText2 = this.add.text(10, 40, "coord2");

        let startX = 100;
        let startY = 100;

        // 8 16 24 32
        // 18 36 54 72

        //let offset = 54;
        let offset = 50;

        //let tileHeight = 72;
        let tileHeight = 64;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 12; x++) {
                let posX = startX + (x * offset);
                let posY = startY + (y * tileHeight);

                if (x % 2 !== 0) {
                    posY += Math.floor(tileHeight / 2); // shift down half a "tile"
                }

                this.add.sprite(posX, posY, "hex")
                    .setScale(2)
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

        //this.magicFunction(pX - 100, pY - 100);
        this.magicFunction2(pX - 100, pY - 100);
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

        //console.log(`xmod:${xMod} ymod:${yMod} hx:${coordX} hy:${coordY} tilingWidth: ${tilingWidth}`);

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

    private magicFunction2(mapX: number, mapY: number) {

        const tilingWidth = 64 + 50;
        const tilingHeight = 64;

        let coordX = Math.floor(mapX / tilingWidth) * 2;
        const xMod = Math.floor(mapX % tilingWidth);

        let coordY = Math.floor(mapY / tilingHeight);
        const yMod = Math.floor(mapY % tilingHeight);

        //console.log(`xmod:${xMod} ymod:${yMod} hx:${coordX} hy:${coordY} tilingWidth: ${tilingWidth}`);

        if (yMod < Math.floor(tilingHeight / 2)) {
            //Top half of the "tile"
            if (this.isLeft(16, 0, 0, 32, xMod, yMod)) {
                //It's to the left
                coordX--;
                coordY--;
                
            }
            else if (this.isLeft(48, 0, 64, 32, xMod, yMod)) {
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
            if (this.isLeft(0, 32, 16, 64, xMod, yMod)) {
                // It's to the left
                coordX--;
            }
            else if (this.isLeft(64, 32, 48, 64, xMod, yMod)) {
                // do nothing - it's in the main hex
            }
            else {
                // It's to the rigth
                coordX++;
            }
        }

        this.posText2.text = `coord2 x: ${coordX} y: ${coordY}`;
    }

    // This uses cross product:
    // https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line#:~:text=Using%20the%20equation%20of%20the,point%20is%20on%20the%20line.
    private isLeft(aX: number, aY: number, bX: number, bY: number, cX: number, cY: number): boolean {
        return ((bX - aX) * (cY - aY) - (bY - aY) * (cX - aX)) > 0; 
    }
}