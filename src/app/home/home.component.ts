import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Room } from '../room';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fullUser: boolean;
  display_name: string;
  openStart: boolean = false;
  openJoin: boolean = false;
  closeStart: boolean = false;
  closeJoin: boolean = false;
  @ViewChild('startRoomNameInput') startRoomNameField: ElementRef;
  @ViewChild('joinRoomNameInput') joinRoomNameField: ElementRef;
  startRoomName: string;
  joinRoomName: string;
  newRoom: Room;
  
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
        if (user.display_name) {
          this.display_name = user.display_name;
          this.fullUser = true;
        } else {
          this.display_name = `Anonymous ${user.anon_display_name}`;
          this.fullUser = false;
        }
      });
  }

  videoOrPicClick(): void {
    console.log('vidpic clicked');
  }

  openStartClick(): void {
    console.log('start a room clicked');
    this.openJoin = false;
    this.closeStart = false;
    this.openStart = true;
    this.closeJoin = true;
    setTimeout(() => this.startRoomNameField.nativeElement.focus(), 100);
  }
  
  openJoinClick(): void {
    console.log('join a room clicked');
    this.openStart = false;
    this.closeJoin = false;
    this.openJoin = true;
    this.closeStart = true;
    setTimeout(() => this.joinRoomNameField.nativeElement.focus(), 100);
  }

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
