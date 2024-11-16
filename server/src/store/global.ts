import { IPlayer } from "src/types/player";
import { IGlobal, IRoom, TRoomId } from "../types/global";

export class Global {
  private static instance: Global;
  private state: IGlobal;

  private constructor() {
    this.state = {
      rooms: {},
    };
  }

  public static getInstance() {
    if (!Global.instance) {
      Global.instance = new Global();
    }
    return Global.instance;
  }

  public getRoomState(roomId: TRoomId) {
    if (!this.state.rooms[roomId]) {
      this.state.rooms[roomId] = {
        players: [],
        turn: null,
      };
    }
    return this.state.rooms[roomId];
  }

  public setRoomState(roomId: TRoomId, newState: IRoom) {
    this.state.rooms[roomId] = newState;
  }

  public createRoomState(roomId: TRoomId, playerState: IPlayer) {
    this.state.rooms[roomId] = {
      turn: null,
      players: [playerState],
    };
  }

  public updateRoomPlayers(roomId: TRoomId, playerListState: IRoom["players"]) {
    this.state.rooms[roomId].players = playerListState;
  }

  public updateRoomReadyPlayer(
    roomId: TRoomId,
    playerId: IPlayer["id"],
    isReady: boolean
  ) {
    const newPlayersData = this.state.rooms[roomId].players.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          isReady: isReady,
        };
      }

      return player;
    });

    this.state.rooms[roomId].players = newPlayersData;
  }

  public removeRoomPlayer(roomId: TRoomId, playerId: IPlayer["id"]) {
    if (this.state.rooms[roomId]) {
      const playersFiltered = this.state.rooms[roomId].players.filter(
        (player) => player.id !== playerId
      );
      this.state.rooms[roomId].players = playersFiltered;
    }
  }
}
