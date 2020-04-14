import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

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

  constructor(private userService: UserService) { }

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
  }
  
  openJoinClick(): void {
    console.log('join a room clicked');
    this.openStart = false;
    this.closeJoin = false;
    this.openJoin = true;
    this.closeStart = true;
  }

}
