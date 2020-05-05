import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { Room } from '../room';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {

  @Input() user: User;
  @Input() room: Room;

  poker: boolean;

  constructor() { }

  ngOnInit(): void {
    this.launchPoker();
  }

  launchPoker(): void {
    this.poker = true;
  }

}
