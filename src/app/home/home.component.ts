import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Room } from '../room';
import { RoomService } from '../room.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fade: boolean = false;
  openStart: boolean = false;
  openJoin: boolean = false;
  closeStart: boolean = false;
  closeJoin: boolean = false;
  @ViewChild('startRoomNameInput') startRoomNameField: ElementRef;
  @ViewChild('joinRoomNameInput') joinRoomNameField: ElementRef;
  startRoomName: string;
  joinRoomName: string;
  newRoom: Room;
  currentUser: User;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.setDisplayNameAndUserType();
  }

  setDisplayNameAndUserType(): void {
    this.userService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  videoOrPicClick(): void {
    console.log('vidpic clicked');
  }
  
  openStartClick(): void {
    this.openStart = true;
    this.openJoin = false;
    this.closeJoin = true;
    this.fade = true;
  }

  openJoinClick(): void {
    this.openStart = false;
    this.openJoin = true;
    this.closeStart = true;
    this.fade = true;
  }

  resetBooleans(): void {
    this.fade = false;
    this.openStart = false;
    this.openJoin = false;
    this.closeStart = false;
    this.closeJoin = false;
  }


  // openStartClick(): void {
  //   console.log('start a room clicked');
  //   this.openJoin = false;
  //   this.closeJoin = !this.closeJoin;
  //   this.closeStart = false;
  //   this.openStart = !this.openStart;
  //   setTimeout(() => this.startRoomNameField.nativeElement.focus(), 100);
  // }


  startRoom(){
    console.log('starting and joining room:', this.startRoomName);
    
    const name = this.startRoomName;
    if (!name) { return; } // return early if the room name is blank
    this.roomService.addRoom({ name } as Room)
      .subscribe(room => {
        if (room) {
          this.newRoom = room;
          console.log('new room created:', this.newRoom);
          this.router.navigate([this.newRoom.name]);
        }
      })
  }

  joinRoom(){
    console.log('joining room:', this.joinRoomName);
    this.router.navigate([this.joinRoomName]);
  }

}
