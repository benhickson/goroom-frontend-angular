import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { Room } from '../room';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';
import { UserService } from '../user.service';
import { User } from '../user';
import { PlayerService } from '../games/player.service';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @ViewChild('modal_1') modal_1: TemplateRef<any>;
  @ViewChild('vc', {read:ViewContainerRef}) vc: ViewContainerRef;

  room: Room;
  roomNotFound: boolean = false;
  user: User;
  fullUser: boolean;
  profiledUser: User;
  time: number;

  localCallId = 'agora_local';
  remoteCalls: string[] = [];
  remoteCallUsers = {};

  cameraCountClassNumber: number = 2;

  playerList: {id: number, displayName: string}[] = [];
  currentPlayer: number;
  currentDealer: number;
  playerCardsChips: {playerId: number, cards: string[], chips: number}[];

  gameNodeOrder = {
    count1: {
      game: 2,
      players: [1]
    },
    count2: {
      game: 2,
      players: [1,3]
    },
    count3: {
      game: 2,
      players: [1,4,3]
    },
    count4: {
      game: 2,
      players: [1,3,6,4]
    },
    count5: {
      game: 2,
      players: [1,3,6,5,4]
    },
    count6: {
      game: 5,
      players: [1,2,3,6,8,4]
    },
    count7: {
      game: 5,
      players: [1,2,3,6,9,7,4]
    },
    count8: {
      game: 5,
      players: [1,2,3,6,9,8,7,4]
    }
  }

  sidebarOpen: boolean = false;
  gameboardOpen: boolean = false;

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private ngxAgoraService: NgxAgoraService,
    private userService: UserService,
    private playerService: PlayerService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {
    this.setUserAndJoinRoom();
    // subscribe to data from the PlayerService
    this.playerService.currentPlayer.subscribe(playerId => this.currentPlayer = playerId);
    this.playerService.currentDealer.subscribe(dealerId => this.currentDealer = dealerId);
    this.playerService.playerList.subscribe(listOfPlayers => this.playerList = listOfPlayers);
    this.playerService.playerCardsChips.subscribe(listOfPlayerCardsChips => {
      this.playerCardsChips = listOfPlayerCardsChips;
    });    
  }

  ngOnDestroy(): void {
    if (this.room) {
      this.leave();
    }
  }

  addTempUser(): void {
    console.log('added');
    const nextTempUserId = this.remoteCalls.length + 1;
    const remoteCallId = `temp_user-${nextTempUserId}`;
    this.userService.getUser(nextTempUserId)
      .subscribe(user => {
        console.log(user);
        this.remoteCallUsers[remoteCallId] = user;
        this.remoteCalls.push(remoteCallId);
        this.updateCameraCount();
      })
  }

  order(userId: number): number {
    // disabled for now with 'false'
    if (false && this.playerList.length > 0) {

      const key = `count${this.playerList.length}`;
      const gameNodeOrder = this.gameNodeOrder[key];

      if (userId === 0) { // handler for the gameboard

        return gameNodeOrder.game;

      } else {

        const playerPositionIndex = this.playerList.findIndex(player => player.id === userId);
        return gameNodeOrder.players[playerPositionIndex];
      }

    } else {
      return 0; // default value of css 'order' property, when the player list hasn't been init'ed yet
    }
  }

  // booleans for conditionals in template
  currentPlayerIs(userId: number): boolean {
    return userId === this.currentPlayer;
  }
  currentDealerIs(userId: number): boolean {
    return userId === this.currentDealer;
  }

  newGame(): void {
    this.gameboardOpen = true;
    this.updateCameraCount();
  }

  closeGame(): void {
    this.gameboardOpen = false;
    this.updateCameraCount();    
  }

  loadProfile(user_id) {
    console.log('loading profile of user_id:', user_id, '...');
    this.userService.getUser(user_id)
      .subscribe(user => {
        console.log('profile loaded:', user);
        this.profiledUser = user;
        this.time = Date.now();
        if (this.sidebarOpen) {
          // clear/reset any content if necessary
        } else {
          this.openSidebar();
        }
      })
    
  }

  openSidebar(): void {
    this.sidebarOpen = true;
    // trigger the resize event for the fittext directive to run
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
    // trigger the resize event for the fittext directive to run
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }

  setUserAndJoinRoom(): void {
    this.userService.getCurrentUser()
      .subscribe(user => {
        this.user = user;
        if (user.display_name) {
          this.fullUser = true;
        } else {
          this.fullUser = false;
        }
        this.uid = user.id;
        this.joinRoom();
      });
  }

  joinRoom(): void {
    const name: string = this.route.snapshot.paramMap.get('name');
    this.roomService.getRoomByName(name)
      .subscribe(room => {
        this.room = room;
        if (this.room) {
          console.log('joining room');
          this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
          this.assignClientHandlers();
      
          // initialize local A/V stream
          this.localStream = this.ngxAgoraService.createStream({
            streamID: `user_id-${this.uid}`,
            audio: true,
            video: true,
            screen: false
          });
          this.assignLocalStreamHandlers();
          this.initLocalStream(
            () => this.join(
              uid => this.publish(),
              error => console.error(error)
            )
          );
          this.subscribeDevices();
        } else {
          console.log('room not found');
          this.roomNotFound = true;
        }
      });
  }

  getRemoteUser(remoteCallId, stream){
    this.userService.getUser(remoteCallId.split('-')[2])
      .subscribe(user => {
        console.log(user);
        this.remoteCallUsers[remoteCallId] = user;
        this.remoteCalls.push(remoteCallId);
        this.updateCameraCount();
        setTimeout(() => stream.play(remoteCallId), 1000);
      })
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null, `room_id-${this.room.id}`, `user_id-${this.uid}`, onSuccess, onFailure)
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room
   */
  publish(): void {
    this.client.publish(this.localStream, error => console.log('Publish local stream error: ' + error));
  }

  leave() {
    this.client.leave(() => {
      console.log("Left channel successfully");
      // close the local stream
      this.localStream.close();
    }, (err) => {
      console.log("Failed to leave channel");
    });
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('local stream access allowed.');
    });

    // The user has denied access to the camera and mic
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('local stream access denied.');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      error => console.error('getUserMedia failed', error)
    );
  }

  private assignClientHandlers(): void {

    this.client.on(ClientEvent.Error, error => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, event => {
      const stream = event.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, error => {
        console.log('Subscribe stream failed', error);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, event => {
      const stream = event.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.includes(id)) { 
        this.getRemoteUser(id, stream);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, event => {
      const stream = event.stream as Stream;
      if (stream) {
        stream.stop();
        // probably not running?
        this.remoteCalls.filter(call => call !== this.getRemoteId(stream));
        // not running?
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, event => {
      const stream = event.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${event.uid} left from this channel`);
        this.updateCameraCount();
      }
    });

  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }

  private updateCameraCount() {
    const nodeCount = this.remoteCalls.length + (this.gameboardOpen ? 1 : 0 ) + 1; // 1 is for the local call
    console.log('node count:', nodeCount);

    if (nodeCount <= 2){
      this.cameraCountClassNumber = 2;
    } else if (nodeCount <= 4){
      this.cameraCountClassNumber = 4;
    } else if (nodeCount <= 6){
      this.cameraCountClassNumber = 6;
    } else if (nodeCount <= 9){
      this.cameraCountClassNumber = 9;
    } else if (nodeCount <= 12){
      this.cameraCountClassNumber = 12;
    } else if (nodeCount <= 16){
      this.cameraCountClassNumber = 16;
    } else if (nodeCount <= 20){
      this.cameraCountClassNumber = 20;
    }

    // trigger the resize event for the fittext directive to run
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
  }

  private subscribeDevices() {
    this.deviceService.getAudioInputDeviceId().subscribe((deviceId) => {
      if (deviceId) {
        this.localStream.switchDevice("audio", deviceId, () => {
          console.log(`successfully changed audio input device {deviceId}`)
        }, () => {
          console.log(`failed to change audio input device to {deviceId}`)
        })
      }
    });
    this.deviceService.getAudioOutputDeviceId().subscribe((deviceId) => {
      if (deviceId) {
        this.localStream.switchDevice("audio", deviceId, () => {
          console.log(`successfully changed audio output device to {deviceId}`)
        }, () => {
          console.log(`failed to change audio output device to {deviceId}`)
        })
      }
    });
    this.deviceService.getVideoDeviceId().subscribe((deviceId) => {
      if (deviceId) {
        this.localStream.switchDevice("video", deviceId, () => {
          console.log(`successfully change video device to {deviceId}`)
        }, () => {
          console.log(`failed to change audio output device to {deviceId}`)
        })
      }
    })
  }

  showDialog(){
    let view = this.modal_1.createEmbeddedView(null);
    this.vc.insert(view);
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.remove('hhidden');
    this.modal_1.elementRef.nativeElement.previousElementSibling.classList.add('sshow');
  }
  
  closeDialog() {
    this.vc.clear()
  }
}
