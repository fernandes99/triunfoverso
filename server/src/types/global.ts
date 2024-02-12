import { ITurn } from './turn';
import { IUser } from './user';

export interface IGlobal {
    users: IUser[];
    turn: ITurn | null;
}
