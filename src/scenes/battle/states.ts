import { DCharacter, GameScene, MenuItem } from "../gameScene";

interface State {
    enter(): void;
    exit(): void;
}

export class StateManager {

    private currentState : State;

    constructor(public readonly gameScene: GameScene)  {
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
        private readonly stateManager: StateManager,
        private readonly characters: DCharacter[]) {
    }

    enter(): void {
        console.log("Enter Main State");
        const nextCharacter = this.characters.shift();
        this.characters.push(nextCharacter);

        const nextState = new ActivateCharacterState(this.stateManager, nextCharacter);        
        this.stateManager.nextState(nextState);
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
        this.stateManager.gameScene.destroyMenuItems();
    }

    exit(): void {
        console.log("Exit ActivateCharacterState");
    }
}