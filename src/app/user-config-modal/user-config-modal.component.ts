import { Component, OnInit, ElementRef } from '@angular/core';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';
import { DeviceService } from '../device.service';

@Component({
  selector: 'user-config-modal',
  templateUrl: './user-config-modal.component.html',
  styleUrls: ['./user-config-modal.component.scss']
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
          // Set audio to true if testing microphone
          audio: true,
          // Set video to true if testing camera
          video: true,
          screen: false
      });
      // Initialize the stream
      this.localStream.init(() => {
        this.localStream.play("video-preview", {fit: "contain"});
        // Print the audio level every 1000 ms
        this.micCheckID = setInterval(() => {
          this.audioInputLevel = (this.localStream.getAudioLevel() * 100).toString() + "%";
        }, 100);
        console.log(this.micCheckID)
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
    console.log("applied new settings")
    this.deviceService.setAudioInputDeviceId(this.selectedAudioInputDeviceId)
    this.deviceService.setAudioOutputDeviceId(this.selectedAudioOutputDeviceId)
    this.deviceService.setVideoDeviceId(this.selectedVideoDeviceId)
  }

  ngOnDestroy() {
    this.localStream.close()
    clearInterval(this.micCheckID)
    this.el.nativeElement.classList.remove('sshow')
    this.el.nativeElement.classList.add('hhidden')
  }
}
