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

  startARoom(): void {
    console.log('start a room clicked');
  }
  
  joinARoom(): void {
    console.log('join a room clicked');
  }

}
