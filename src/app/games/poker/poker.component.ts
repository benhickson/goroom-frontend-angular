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

  winners: any[] = [];
  
  gameStage: number;
  turnOptions: string;
  // turnOptions: string = 'before-bets';
  // turnOptions: string = 'after-bets';
  // turnOptions: string = 'end-called';
  
  costToCall: number = 0;
  betAmount: number = 0;
  raiseAmount: number = 0;

  publicSocket;
  privateSocket;

  // Temp date for the template
  // flopCards: string[] = ['five clubs','seven hearts','four spades'];
  // turnCards: string[] = ['five clubs','seven hearts','four spades','nine clubs'];
  // riverCards: string[] = ['five clubs','seven hearts','back','nine clubs','seven diamonds'];
  // playerCardsVisible: string[][] = [['five spades','seven clubs'],['four clubs','ace spades'],['queen hearts','six diamonds'],['king diamonds','four diamonds']];
  // playerCardsTemp: {playerId: number, cards: string[], chips: number}[] = [
  //   {playerId: 35, cards: ['four clubs','ace spades'], chips: 140.50},
  //   {playerId: 1, cards: ['back','back'], chips: 105},
  //   {playerId: 2, cards: ['back','back'], chips: 200.01},
  //   {playerId: 3, cards: ['back','back'], chips: 25.30},
  //   {playerId: 4, cards: ['back','back'], chips: 15},
  // ]

  constructor(
    private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    console.clear();    // clear some jank during dev

    // subscribe to data from the PlayerService
    this.playerService.currentPlayer.subscribe(playerId => this.currentPlayer = playerId);
    this.playerService.currentDealer.subscribe(dealerId => this.currentDealer = dealerId);
    this.playerService.playerList.subscribe(listOfPlayers => this.playerList = listOfPlayers);

    // make socket connections
    this.publicSocket = io('localhost:5000', {
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
    this.publicSocket.on('game_state', this.handleGameStateMessage)
    this.publicSocket.on('private_state_available', this.handlePrivateStateAvailable)
    this.publicSocket.on('test_messages', this.handleTestMessages)
    this.publicSocket.on('illegal_move_message', this.handleIllegalMoveMessage)
  }

  handleTestMessages = (message): void => {
    console.log(message);
  }
  handleIllegalMoveMessage = (message): void => {
    console.log('illegal move:', message);
  }

  ngOnDestroy(): void {
    // disconnect sockets
    console.log(this.publicSocket.disconnect());
    // console.log(this.privateSocket.disconnect());

    this.playerService.changeCurrentPlayer(null);

    // clear the player state via the service
    this.playerService.changePlayerCardsChips([]);
  }

  // socket.io message handlers
  handlePlayersJoined = (message): void => {
    this.playerService.changePlayerList(message.pendingPlayerList);
  }
  handlePlayerLeft(message): void {
    console.log('user left:', message.user_name, 'id:', message.user_id);
  }
  handleGameStateMessage = (message): void => {
    console.log('game state:', message);
    this.gameActive = message.started;

    if (this.gameActive) {

      this.playerService.changePlayerList(
        [...message.players]
          .sort((a, b) => a.position - b.position)
          .map(player => ({id: player.id, displayName: player.display_name}))
      );
      this.playerService.changePlayerCardsChips(message.players.map(player => {
        return {playerId: player.id, cards: player.cards, chips: player.chips}
      }));
      this.playerService.changeCurrentDealer(message.dealer);
      this.potChips = message.pot;
      this.sharedCards = message.board_cards;
      this.playerService.changeCurrentPlayer(message.next_player);

      this.winners = message.hand_winners
      
      // only load this stuff if it's my turn
      if (message.next_player === this.user.id) {
        this.turnOptions = message.turn_options;
        this.costToCall = message.cost_to_call;
      }

      // game stage zero is used to show the "Deal Cards" button
      this.gameStage = message.stage

    } else {
      // if my id is in the list of pending players
      if (message.pending_players.map(player => player.id).includes(this.user.id)) {
        // go ahead and update state
        this.playerService.changePlayerList(
          message.pending_players.map(player => (
            {id: player.id, displayName: player.display_name}
          ))
        );
      } else {
        // request to be added to the list
        this.publicSocket.emit('join_game');
      }
    }
  }
  handlePrivateStateAvailable = (): void => {
    this.publicSocket.emit('private_game_state_request');
  }

  // method for the template to know if it's my turn, and to show the action buttons
  isMyTurn(): boolean {
    // return true;
    if (this.currentPlayer === this.user.id) {
      return true;
    } else {
      return false;
    }
  }

  displayWinnerOutputText(): string {
    if (this.winners.length > 0) {
      return `The winner is:
              ${this.winners[0].display_name}
              with: 
              ${this.winners[0].hand_name}
              !`;
    } else {
      return 'No winner yet.';
    }
  }

  // action buttons
  startGame(): void {
    console.log('game started!');
    this.publicSocket.emit('start_game');
  }
  dealCards(): void {
    console.log('dealing...');
    this.publicSocket.emit('deal_cards');
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
  placeBet(): void {
    console.log('betting:', this.betAmount);
    this.emitUserMove({type: 'bet', amount: this.betAmount});
    this.betAmount = 0;
  }
  raiseBet(): void {
    console.log('raising with a bet of:', this.getTotalCostToRaise());
    this.emitUserMove({type: 'raiseBet', amount: this.getTotalCostToRaise()});
    this.raiseAmount = 0;
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

  // changeCurrentPlayer(playerId: number) {
    //   this.playerService.changeCurrentPlayer(playerId);
    // }
    // changePlayerList(listOfPlayerIds: {id: number, displayName: string}[]) {
  //   this.playerService.changePlayerList(listOfPlayerIds);
  // }
  // deal(): void {
  //   this.playerService.changePlayerCardsChips(this.playerCardsTemp);
  // }
  // flop(): void {
    //   this.updateSharedCards(this.flopCards);
  // }
  // turn(): void {
    //   this.updateSharedCards(this.turnCards);
  // }
  // river(): void {
  //   this.updateSharedCards(this.riverCards);
  // }
  // updateSharedCards(newCardArray: string[]): void {
  //   this.sharedCards = newCardArray
  // }

}
