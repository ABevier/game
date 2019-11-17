import { DCharacter, GameScene, MenuItem } from "../gameScene";

interface State {
    enter(): void;
    exit(): void;
}

export class StateManager {

    private currentState : State;

    constructor(
        public readonly gameScene: GameScene, 
        public readonly characters: DCharacter[]) {
    }

    public nextState(state: State) {
        if (this.currentState) {
            this.currentState.exit();
        }

        this.currentState = state;
        state.enter();
    }
}

export class MainState implements State {

    constructor(
        private readonly stateManager: StateManager) {
    }

    enter(): void {
        console.log("Enter Main State");

        const nextCharacter = this.stateManager.characters.shift();
        this.stateManager.characters.push(nextCharacter);

        if (nextCharacter.getIsEnemy()) {
            //TODO: activate enemy turn
            this.stateManager.nextState(new MainState(this.stateManager));
        } else {
            const nextState = new ActivateCharacterState(this.stateManager, nextCharacter);        
            this.stateManager.nextState(nextState);
        }
    }

    exit(): void {
        console.log("Exit Main State");
    }
}

export class ActivateCharacterState implements State {

    constructor(
        private readonly stateManager: StateManager, 
        private readonly activeCharacter: DCharacter) {
    }

    enter(): void {
        console.log("Enter ActivateCharacterState");
        this.activeCharacter.activate();

        const menuItems = this.activeCharacter.getMenuItems();
        this.stateManager.gameScene.showMenuItems(menuItems, this.onMenuItemClick.bind(this));
    }    

    private onMenuItemClick(menuItem: MenuItem) {
        console.log(`ActivateCharacter state recieved click: ${menuItem.menuText}`);

        const nextState = new SelectTargetState(this.stateManager);
        this.stateManager.nextState(nextState);
    }

    exit(): void {
        this.stateManager.gameScene.destroyMenuItems();
        this.activeCharacter.deactivate();
        console.log("Exit ActivateCharacterState");
    }
}

export class SelectTargetState implements State {

    constructor(private readonly stateManager: StateManager) {
    }

    enter(): void {
        console.log("Enter SelectCharacterState");
        this.stateManager.gameScene.registerEnemiesForClick(this.onEnemyClick.bind(this));
    }

    private onEnemyClick(character: DCharacter) {
        console.log(`An enemy was clicked ${character.getName()}`);
        this.stateManager.nextState(new ProcessCommandState(this.stateManager, character));
    }

    exit(): void {
        console.log("Exit SelectCharacterState");
        this.stateManager.gameScene.removeEnemyClickHandlers();
    }
}

export class ProcessCommandState implements State {

    constructor(
        private readonly stateManager: StateManager,
        private readonly target: DCharacter) {
    }

    enter(): void {
        console.log("Enter ProcessCommandState");
        this.target.setHP(this.target.getHp() - 5);

        let pos = this.target.getPosition();

        let text = this.stateManager.gameScene.add.text(pos.x, pos.y, "5");

        this.stateManager.nextState(new MainState(this.stateManager));
    }

    exit(): void {
        console.log("Exit ProcessCommandState");
    }
} 