import { Component, OnInit } from '@angular/core';
import { Room } from '../room';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  room: Room;
  roomNotFound: boolean = false;

  localCallId = 'agora_local';
  remoteCalls: string[] = [];

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private ngxAgoraService: NgxAgoraService
  ) { 
    this.uid = Math.floor(Math.random() * 100);
  }

  ngOnInit(): void {
    this.joinRoom();
  }

  ngOnDestroy(): void {
    this.leave();
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
        } else {
          console.log('room not found');
          this.roomNotFound = true;
        }
      });
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
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, event => {
      const stream = event.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls.filter(call => call !== this.getRemoteId(stream));
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, event => {
      const stream = event.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${event.uid} left from this channel`);
      }
    });

  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }  
  
}
