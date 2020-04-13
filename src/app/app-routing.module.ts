import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './rooms/rooms.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomComponent } from './room/room.component';
import { LoginRegisterComponent } from './login-register/login-register.component';

const routes: Routes = [
  { path: 'rooms', component: RoomsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: ':name', component: RoomComponent },
  
  // default route / root route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
