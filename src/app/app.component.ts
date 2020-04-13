import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  authed: boolean = !!localStorage.getItem("auth_token");
  title: string = 'GO ROOM';
  display_name: string;

  constructor(private roomService: UserService) { }

  ngOnInit() {
    this.setDisplayName();
  }

  setDisplayName(): void {
    this.roomService.getCurrentUser()
      .subscribe(user => {
        if (user.display_name) {
          this.display_name = user.display_name;
        } else {
          this.display_name = `Anonymous ${user.anon_display_name}`;
        }
      });
  }
}
