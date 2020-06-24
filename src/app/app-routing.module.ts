import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { LoginRegisterComponent } from './login-register/login-register.component';

const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  { path: ':name', component: RoomComponent },
  
  // default route / root route
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
