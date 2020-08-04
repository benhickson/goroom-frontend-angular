import { Component, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';
import { DeviceService } from '../device.service';

@Component({
  selector: 'user-config-modal',
  templateUrl: './user-config-modal.component.html',
  styleUrls: ['./user-config-modal.component.scss'],
})
export class UserConfigModalComponent implements OnInit {

  audioInputDevices: MediaDeviceInfo[]
  audioOutputDevices: MediaDeviceInfo[]
  videoDevices: MediaDeviceInfo[]
  localStream: Stream
  micCheckID: any
  audioInputLevel: string
  selectedAudioInputDeviceId: string
  selectedAudioOutputDeviceId: string
  selectedVideoDeviceId: string

  constructor(
    private el: ElementRef,
    private agoraService: NgxAgoraService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {
    this.getDevices();
  }

  @Output() closeDialog = new EventEmitter<boolean>();

  getDevices() {
    this.agoraService.AgoraRTC.getDevices(devices => {
      this.audioInputDevices = devices.filter(device => {
        return device.kind === "audioinput";
      });
      this.videoDevices = devices.filter(device => {
        return device.kind === "videoinput";
      });
      this.audioOutputDevices = devices.filter(device => {
        return device.kind === "audiooutput";
      });

      let uid = Math.floor(Math.random()*10000);
      this.localStream = this.agoraService.AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
          screen: false,
      });
      // Initialize the stream
      this.localStream.init(() => {
        this.localStream.play("video-preview", {fit: "cover"});
        // Print the audio level every 100 ms
        this.micCheckID = setInterval(() => {
          this.audioInputLevel = (this.localStream.getAudioLevel() * 100).toString() + "%";
          // console.log(this.audioInputLevel);
        }, 100);
      });
    });
  }

  switchVideoDevice(device: string) {
    this.localStream.switchDevice('video', device, () => {
      this.selectedVideoDeviceId = device
      console.log(`Successfully change the video device to ${device}`);
    }, () => {
      console.log("An error occurred while attempting to change the device");
    })
  }

  switchAudioInputDevice(device: string) {
    this.localStream.switchDevice('audio', device, () => {
      console.log(`Successfully changed the audio output device to ${device}`);
      this.selectedAudioInputDeviceId = device
      clearInterval(this.micCheckID)
      this.micCheckID = setInterval(() => {
        this.audioInputLevel = (this.localStream.getAudioLevel() * 100).toString() + "%"
      }, 100);
    }, () => {
      console.log("An error occurred while attempting to change the audio output device");
    });
  }

  switchAudioOutputDevice(device: string) {
    this.localStream.setAudioOutput(device, () => {
      console.log('Successfully changed audio output device.');
    }, () => {
      console.log("An error occurred while attempting to change the audio output device")
    });
  }

  applySettings() {
    console.log("applied new settings");
    this.deviceService.setAudioInputDeviceId(this.selectedAudioInputDeviceId);
    this.deviceService.setAudioOutputDeviceId(this.selectedAudioOutputDeviceId);
    this.deviceService.setVideoDeviceId(this.selectedVideoDeviceId);
    this.closeDialog.emit(true);
  }

  cancelSettings() {
    console.log("canceled");
    this.closeDialog.emit(true);
  }

  ngOnDestroy() {
    this.localStream.close();
    clearInterval(this.micCheckID);
    this.el.nativeElement.classList.remove('show');
    this.el.nativeElement.classList.add('hidden');
  }

}
