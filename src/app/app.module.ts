import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { NgxAgoraModule } from 'ngx-agora';
import { AngularFittextModule } from 'angular-fittext';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { AuthAnonComponent } from './auth-anon/auth-anon.component';
import { HomeComponent } from './home/home.component';
import { DisplayNamePipe } from './display-name.pipe';
import { GameboardComponent } from './gameboard/gameboard.component';
import { PokerComponent } from './games/poker/poker.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    RoomDetailComponent,
    MessagesComponent,
    DashboardComponent,
    LoginRegisterComponent,
    AuthAnonComponent,
    RoomComponent,
    HomeComponent,
    DisplayNamePipe,
    GameboardComponent,
    PokerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("auth_token");
        },
        whitelistedDomains: environment.whitelistedDomains
      }
    }),
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    AngularFittextModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
