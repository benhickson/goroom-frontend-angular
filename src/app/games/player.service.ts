import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private currentPlayerSource = new BehaviorSubject(0);   // 0 is the default value
  currentPlayer = this.currentPlayerSource.asObservable();
  
  private currentDealerSource = new BehaviorSubject(0);   // 0 is the default value
  currentDealer = this.currentDealerSource.asObservable();

  private playerListSource = new BehaviorSubject([]);     // empty array as default
  playerList = this.playerListSource.asObservable();

  private playerCardsChipsSource = new BehaviorSubject([]);
  playerCardsChips = this.playerCardsChipsSource.asObservable();

  constructor() { }

  changeCurrentPlayer(player: number): void {
    this.currentPlayerSource.next(player);
    console.log('current player id:', player);
  }

  changeCurrentDealer(dealer: number): void {
    this.currentDealerSource.next(dealer);
    console.log('dealer id:', dealer);
  }

  // TODO: Refactor to not use this list anymore 
  // - use the "position" property returned from the players array in game state,
  // and add it as a key (maybe called "order") on the playerCardsChips array
  changePlayerList(playerList: {id: number, displayName: string}[]): void {
    this.playerListSource.next(playerList);
  }

  changePlayerCardsChips(playerCardsChips: {playerId: number, cards: string[], chips: number}[]): void {
    this.playerCardsChipsSource.next(playerCardsChips);
  }

}
