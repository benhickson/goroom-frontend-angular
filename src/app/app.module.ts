import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { NgxAgoraModule } from 'ngx-agora';
import { AngularFittextModule } from 'angular-fittext';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { AuthAnonComponent } from './auth-anon/auth-anon.component';
import { HomeComponent } from './home/home.component';
import { DisplayNamePipe } from './display-name.pipe';
import { GameboardComponent } from './gameboard/gameboard.component';
import { PokerComponent } from './games/poker/poker.component';
import { ImageComponent } from './components/image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    AuthAnonComponent,
    RoomComponent,
    HomeComponent,
    DisplayNamePipe,
    GameboardComponent,
    PokerComponent,
    ImageComponent
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
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
