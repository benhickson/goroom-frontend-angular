import { Component, OnInit, Input } from '@angular/core';
import { PlayerService } from '../player.service';
import { User } from 'src/app/user';
import { Room } from 'src/app/room';
import io from 'socket.io-client';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {

  @Input() user: User;
  @Input() room: Room;

  currentPlayer: number;
  playerList: number[];

  turnOptions: string = 'before-bets';
  // turnOptions: string = 'after-bets';
  // turnOptions: string = 'end-called';

  publicSocket;
  privateSocket;

  flopCards: string[] = ['five clubs','seven hearts','four spades'];
  turnCards: string[] = ['five clubs','seven hearts','four spades','nine clubs'];
  riverCards: string[] = ['five clubs','seven hearts','back','nine clubs','seven diamonds'];
  playerCardsVisible: string[][] = [['five spades','seven clubs'],['four clubs','ace spades'],['queen hearts','six diamonds'],['king diamonds','four diamonds']];
  playerCardsTemp: {playerId: number, cards: string[], chips: number}[] = [
    {playerId: 35, cards: ['four clubs','ace spades'], chips: 140.50},
    {playerId: 1, cards: ['back','back'], chips: 105},
    {playerId: 2, cards: ['back','back'], chips: 200.01},
    {playerId: 3, cards: ['back','back'], chips: 25.30},
    {playerId: 4, cards: ['back','back'], chips: 15},
  ]
  sharedCards: string[];

  constructor(
    private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    // subscribe to data from the PlayerService
    this.playerService.currentPlayer.subscribe(playerId => this.currentPlayer = playerId);
    this.playerService.playerList.subscribe(listOfPlayerIds => this.playerList = listOfPlayerIds);

    // make socket connections
    // this.publicSocket = io('http://localhost:3000', {
    //   path: '/public'
    // });
    // this.privateSocket = io('http://localhost:3000', {
    //   path: '/private'
    // });
  }

  ngOnDestroy(): void {
    // disconnect sockets
    // console.log(this.privateSocket.disconnect());
    // console.log(this.publicSocket.disconnect());
  }

  changeCurrentPlayer(playerId: number) {
    this.playerService.changeCurrentPlayer(playerId);
  }
  changePlayerList(listOfPlayerIds: number[]) {
    this.playerService.changePlayerList(listOfPlayerIds);
  }

  updateSharedCards(newCardArray: string[]): void {
    this.sharedCards = newCardArray
  }

  // check this against state
  myTurn(): boolean {
    return true;
  }

  // temp methods for modifying game state.
  // state will actually be modified directly via sockets
  deal(): void {
    this.playerService.changePlayerCardsChips(this.playerCardsTemp);
  }
  flop(): void {
    this.updateSharedCards(this.flopCards);
  }
  turn(): void {
    this.updateSharedCards(this.turnCards);
  }
  river(): void {
    this.updateSharedCards(this.riverCards);
  }

}
