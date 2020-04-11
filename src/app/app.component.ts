import { Component, OnInit } from '@angular/core';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent } from 'ngx-agora';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GO ROOM';
  localCallId = 'agora_local';
  remoteCalls: string[] = [];

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;

  constructor(private ngxAgoraService: NgxAgoraService) {
    this.uid = Math.floor(Math.random() * 100);
  }

  ngOnInit() {
    this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();
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
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, event => {
      const stream = event.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
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
