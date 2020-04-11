import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  loginForm = new FormGroup({
    // loginFields: new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    // })
  });

  constructor(private jwtService: JwtService) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    // pass to JWT service
    this.jwtService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
      .subscribe(
        (response) => {
          // console.log('worked?', response);
        } 
      );
  }

}
