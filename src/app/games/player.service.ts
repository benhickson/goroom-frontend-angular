import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private currentPlayerSource = new BehaviorSubject(0);   // 0 is the default value
  currentPlayer = this.currentPlayerSource.asObservable();

  private playerListSource = new BehaviorSubject([]);     // empty array as default
  playerList = this.playerListSource.asObservable();

  private playerCardsChipsSource = new BehaviorSubject([]);
  playerCardsChips = this.playerCardsChipsSource.asObservable();

  constructor() { }

  changeCurrentPlayer(player: number): void {
    this.currentPlayerSource.next(player);
  }

  changePlayerList(playerList: number[]): void {
    this.playerListSource.next(playerList);
  }

  changePlayerCardsChips(playerCardsChips: {playerId: number, cards: string[], chips: number}[]): void {
    this.playerCardsChipsSource.next(playerCardsChips);
  }

}
