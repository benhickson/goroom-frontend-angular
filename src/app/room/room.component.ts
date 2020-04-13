import { Component, OnInit } from '@angular/core';
import { Room } from '../room';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  room: Room;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.joinRoom();
  }

  joinRoom(): void {
    const name: string = this.route.snapshot.paramMap.get('name');
    this.roomService.getRoomByName(name)
      .subscribe(room => this.room = room);
  }
  
}
