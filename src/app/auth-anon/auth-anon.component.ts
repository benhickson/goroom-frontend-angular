import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-anon',
  templateUrl: './auth-anon.component.html',
  styleUrls: ['./auth-anon.component.scss']
})
export class AuthAnonComponent implements OnInit {

  constructor(private jwtService: JwtService, private router: Router) { }

  ngOnInit(): void {
    this.authAnon();
  }

  authAnon(){
  // pass to JWT service
    this.jwtService.loginAnon()
      .subscribe(() => {
        console.log('you authed, boi');
        // TODO: do this the angular way, rather than reloading the whole page
        location.reload();
      });
  }

}
