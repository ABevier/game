
export class Character {
    hp: number = 100

    takeDamage(damage: number) {
        this.hp -= damage;
    }
}

export interface Command {
    apply(): void
}

export class AttackCommand implements Command {
    constructor(readonly source: Character, readonly target: Character) {
    }

    apply(): void {
        this.target.takeDamage(5);
    }
}

export class BattleState {
    players: Character[] = [];
    enemies: Character[] = [];
}