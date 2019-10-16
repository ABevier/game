import {Character, AttackCommand} from './engine'

test('hax', () => {
    const source = new Character();
    const target = new Character();
    const attack = new AttackCommand(source, target);

    attack.apply();
    expect(target.hp).toBe(95);
});