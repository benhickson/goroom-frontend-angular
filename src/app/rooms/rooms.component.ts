import { Component, OnInit } from '@angular/core';
import { Room } from '../room';
import { RoomService } from '../room.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  selectedRoom: Room;
  rooms: Room[];
  
  constructor(private roomService: RoomService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getRooms();
  }
  
  onSelect(room: Room): void {
    this.selectedRoom = room;
    this.messageService.add(`RoomService: Selected room id=${room.id}`);
  }
  
  getRooms(): void {
    this.roomService.getRooms()
        .subscribe(returnedRooms => this.rooms = returnedRooms);
  }

}
