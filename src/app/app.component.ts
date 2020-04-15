import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  authed: boolean = !!localStorage.getItem("auth_token");
  title: string = 'GO ROOM';
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.setDisplayName();
  }

  setDisplayName(): void {
    this.userService.getCurrentUser()
      .subscribe(user => {
        this.user = user;
      });
  }

}
