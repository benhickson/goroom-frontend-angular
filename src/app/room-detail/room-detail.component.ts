import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../room';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  @Input() room: Room;

  constructor() { }

  ngOnInit(): void {
  }

}
