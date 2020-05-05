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

  private playerCardsSource = new BehaviorSubject([]);
  playerCards = this.playerCardsSource.asObservable();

  constructor() { }

  changeCurrentPlayer(player: number): void {
    this.currentPlayerSource.next(player);
  }

  changePlayerList(playerList: number[]): void {
    this.playerListSource.next(playerList);
  }

  changePlayerCards(playerCards: {playerId: number, cards: string[]}[]): void {
    this.playerCardsSource.next(playerCards);
  }

}
