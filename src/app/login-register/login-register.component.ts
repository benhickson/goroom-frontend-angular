import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  registerForm = new FormGroup({
    display_name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  showRegister: boolean = false;

  constructor(private jwtService: JwtService, private router: Router) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    // pass to JWT service
    this.jwtService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
      .subscribe(
        (response) => {
          console.log('logged in');
          this.resetForms();
          this.router.navigateByUrl('dashboard');
        }
      );
  }

  onRegisterSubmit() {
    // pass to JWT service
    this.jwtService.register(
      this.registerForm.get('email').value,
      this.registerForm.get('password').value,
      this.registerForm.get('display_name').value
    )
      .subscribe(
        (response) => {
          console.log('registered');
          this.resetForms();
          this.router.navigateByUrl('dashboard');
        }
      );
  }

  logout() {
    this.jwtService.logout();
    this.resetForms();
  }

  toggleForm(){
    this.showRegister = !this.showRegister;
  }

  resetForms(){
    this.loginForm.reset();
    this.registerForm.reset();
  }

}
