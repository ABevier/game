import { Dragon } from "./dragon";
import * as Core from "../../core/core";
import { BattleScene } from "../battleScene";

type Vector2 = Phaser.Math.Vector2;

export class AutoAttack {

    private sprite: Phaser.GameObjects.Sprite;

    private readonly speed = 12;

    public constructor(readonly scene: BattleScene, readonly target: Dragon, x: number, y: number) {
        this.sprite = scene.add.sprite(x, y, "spear");
    }

    public update() {
        const from = this.sprite.getCenter();
        const to = this.target.getCenter();

        const angle = Core.angleBetween(from, to);

        const distanceTo = Core.distanceBetween(from, to);
        if (this.speed > distanceTo) {
            this.sprite.destroy();
            this.scene.destroyAutoAttack(this);
            return;
        }

        const newPoint = Core.findPointAtDistance(from, angle, this.speed);

        this.sprite.rotation = angle;
        this.sprite.x = newPoint.x;
        this.sprite.y = newPoint.y;
    }
}