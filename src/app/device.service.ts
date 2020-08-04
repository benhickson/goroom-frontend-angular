import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private audioInputDeviceId: BehaviorSubject<string> 
  private audioOutputDeviceId: BehaviorSubject<string> 
  private videoDeviceId: BehaviorSubject<string> 

  constructor() {
    this.audioInputDeviceId = new BehaviorSubject<string>("");
    this.audioOutputDeviceId = new BehaviorSubject<string>("");
    this.videoDeviceId = new BehaviorSubject<string>("");
  }

  setAudioInputDeviceId(deviceId: string): void {
    this.audioInputDeviceId.next(deviceId)
  }
  setAudioOutputDeviceId(deviceId: string): void {
    this.audioOutputDeviceId.next(deviceId)
  }
  setVideoDeviceId(deviceId: string): void {
    this.videoDeviceId.next(deviceId)
  }

  getAudioInputDeviceId(): Observable<string> {
    return this.audioInputDeviceId.asObservable()
  }
  getAudioOutputDeviceId(): Observable<string> {
    return this.audioOutputDeviceId.asObservable()
  }
  getVideoDeviceId(): Observable<string> {
    return this.videoDeviceId.asObservable()
  }
  
}
