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

  playerList: {id: number, displayName: string}[] = [];
  currentPlayer: number;
  currentDealer: number;

  gameActive: boolean;
  potChips: number = 0;
  sharedCards: string[];
  
  // turnOptions: string;
  // turnOptions: string = 'before-bets';
  turnOptions: string = 'after-bets';
  // turnOptions: string = 'end-called';
  
  costToCall: number = 50;
  betAmount: number = 0;
  raiseAmount: number = 0;

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

  constructor(
    private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    // subscribe to data from the PlayerService
    this.playerService.currentPlayer.subscribe(playerId => this.currentPlayer = playerId);
    this.playerService.playerList.subscribe(listOfPlayerIds => this.playerList = listOfPlayerIds);

    // make socket connections
    this.publicSocket = io('localhost:5000/test', {
      query: {
        room_id: this.room.id
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': `Bearer ${localStorage.getItem("auth_token")}`
          }
        }
      }
    });
    // this.privateSocket = io('http://localhost:5000/test', {
    // });

    // listen for messages
    this.publicSocket.on('players_joined', this.handlePlayersJoined)
    this.publicSocket.on('player_left', this.handlePlayerLeft)
    this.publicSocket.on('update_game_state', this.handleUpdateGameState)
    this.publicSocket.on('private_state_available', this.handlePrivateStateAvailable)
  }

  ngOnDestroy(): void {
    // disconnect sockets
    console.log(this.publicSocket.disconnect());
    // console.log(this.privateSocket.disconnect());

    // clear the player state via the service
    this.playerService.changePlayerCardsChips([]);
  }

  // socket.io message handlers
  handlePlayersJoined = (message): void => {
    console.log(message);
    this.playerService.changePlayerList(message.pendingPlayerList);
  }
  handlePlayerLeft(message): void {
    console.log('user left:', message.user_name, 'id:', message.user_id);
  }
  handleUpdateGameState = (message): void => {
    console.log('game state:', message);
    this.gameActive = true;
    const newPlayerCardsChips = message.players.map(player => {
      return {playerId: player.id, cards: player.hand, chips: player.stack}
    })
    this.playerService.changePlayerCardsChips(newPlayerCardsChips);
  }
  handlePrivateStateAvailable = (): void => {
    this.publicSocket.emit('private_game_state_request');
  }

  changeCurrentPlayer(playerId: number) {
    this.playerService.changeCurrentPlayer(playerId);
  }
  changePlayerList(listOfPlayerIds: {id: number, displayName: string}[]) {
    this.playerService.changePlayerList(listOfPlayerIds);
  }

  updateSharedCards(newCardArray: string[]): void {
    this.sharedCards = newCardArray
  }

  // check this against state
  myTurn(): boolean {
    return true;
  }

  // action buttons
  startGame(): void {
    console.log('game started!');
    this.publicSocket.emit('start_game');
  }
  // user moves
  fold(): void {
    console.log('folding...');
    this.emitUserMove({type: 'fold'});
  }
  check(): void {
    console.log('checking...');
    this.emitUserMove({type: 'check'});
  }
  call(): void {
    console.log('calling...');
    this.emitUserMove({type: 'call'});
  }
  bet(): void {
    console.log('betting:', this.betAmount);
    this.emitUserMove({type: 'bet', amount: this.betAmount});
  }
  raiseBet(): void {
    console.log('raising with a bet of:', this.getTotalCostToRaise());
    this.emitUserMove({type: 'raiseBet', amount: this.getTotalCostToRaise()});
  }
  // show and muck
  showCards(): void {
    console.log('showing cards...');
    this.emitUserMove({type: 'showCards'});
  }
  muckCards(): void {
    console.log('mucking cards...');
    this.emitUserMove({type: 'muckCards'});
  }
  // emitter
  emitUserMove(move: any): void {
    this.publicSocket.emit('user_move', move);
  }

  // bet amount methods
  getTotalCostToRaise(): number {
    return this.costToCall + this.raiseAmount;
  }
  changeBet(newAmount: string): void {
    this.betAmount = parseFloat(newAmount) || 0;
  }
  changeRaise(newAmount: string): void {
    this.raiseAmount = parseFloat(newAmount) || 0;
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
