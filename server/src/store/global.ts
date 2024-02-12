import { IGlobal } from '../types/global';

export class Global {
    private static instance: Global;
    private state: IGlobal;

    private constructor() {
        this.state = {
            users: [],
            turn: null
        };
    }

    public static getInstance() {
        if (!Global.instance) {
            Global.instance = new Global();
        }
        return Global.instance;
    }

    public getState() {
        return this.state;
    }

    public setState(newState: IGlobal) {
        this.state = newState;
    }

    public updateUsers(newState: IGlobal['users']) {
        this.state.users = newState;
    }

    public updateTurn(newState: IGlobal['turn']) {
        this.state.turn = newState;
    }
}
