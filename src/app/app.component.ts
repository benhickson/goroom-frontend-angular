import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  authed: boolean = !!localStorage.getItem("auth_token");
  title: string = 'GO ROOM';
  user: User;

  constructor(private userService: UserService, public router: Router) { 

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaTrackingId}`;
    document.head.prepend(gaScript);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag(
          'config',
          environment.gaTrackingId,
          {
            'page_path': event.urlAfterRedirects
          }
        );
        gtag('event', 'screen_view', {
          'app_name': 'Go Room Web',
          'screen_name': event.urlAfterRedirects
        });
      }
    });
    
  }

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
