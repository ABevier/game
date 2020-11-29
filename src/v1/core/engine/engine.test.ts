import {Character, AttackCommand, BattleState} from './engine'

test('hax', () => {
    const state = new BattleState();
    state.characters.set("src", new Character());
    state.characters.set("tgt", new Character());

    const attack = new AttackCommand("src", "tgt");

    attack.apply(state);

    expect(state.findCharacter("tgt").hp).toBe(95);
});