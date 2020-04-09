import { Component, OnInit } from '@angular/core';
import { Room } from '../room';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];
  getRooms(): void {
    this.roomService.getRooms()
        .subscribe(returnedRooms => this.rooms = returnedRooms);
  }

  selectedRoom: Room;
  onSelect(room: Room): void {
    this.selectedRoom = room;
  }

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.getRooms();
  }

}
