import { TDeck } from "@shared/types/deck";
import { TPlayer } from "@shared/types/player";
import { TGlobal, TRoom, TRoomId } from "../types/global";

export class Global {
  private static instance: Global;
  private state: TGlobal;

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
    const existRoom = !!this.state.rooms[roomId];

    if (!existRoom) {
      this.state.rooms[roomId] = {
        players: [],
        turn: null,
        deck: null,
      };
    }

    console.log(`Room State ${roomId}`, this.state.rooms[roomId]);

    return this.state.rooms[roomId];
  }

  public setRoomState(roomId: TRoomId, newState: TRoom) {
    this.state.rooms[roomId] = newState;
  }

  public updateRoomPlayers(roomId: TRoomId, playerListState: TRoom["players"]) {
    this.state.rooms[roomId].players = playerListState;
  }

  public setRoomDeck(roomId: TRoomId, deck: TDeck) {
    this.state.rooms[roomId].deck = deck;
  }

  public updateRoomReadyPlayer(
    roomId: TRoomId,
    playerId: TPlayer["id"],
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

  public removeRoomPlayer(roomId: TRoomId, playerId: TPlayer["id"]) {
    if (this.state.rooms[roomId]) {
      const playersFiltered = this.state.rooms[roomId].players.filter(
        (player) => player.id !== playerId
      );
      this.state.rooms[roomId].players = playersFiltered;
    }
  }
}
