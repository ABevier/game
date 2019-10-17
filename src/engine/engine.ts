
export class Character {
    hp: number = 100

    takeDamage(damage: number): number {
        this.hp -= damage;
        return damage;
    }
}

export interface Command {
    apply(state: BattleState): void
}

export class AttackCommand implements Command {
    constructor(readonly sourceId: string, readonly targetId: string) {
    }

    apply(state: BattleState): void {
        const target = state.findCharacter(this.targetId);
        const damage = target.takeDamage(5);
    }
}

export class BattleState {
    characters: Map<string, Character> = new Map();

    findCharacter(id: string) {
        return this.characters.get(id);
    }
}

export interface BattleEvent {

}