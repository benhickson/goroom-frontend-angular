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

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.roomService.addRoom({ name } as Room)
      .subscribe(room => {
        // push the new room into the rooms array to display it on the page
        this.rooms.push(room);
      })
  }

  close(room: Room): void {
    // trim the list for the DOM
    this.rooms = this.rooms.filter(r => r !== room);
    // call the close method in the service
    this.roomService.closeRoom(room).subscribe();
  }

}
