import { Injectable } from '@angular/core';
import { Room } from './room'
import { ROOMS } from './mock-rooms'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  getRooms(): Observable<Room[]> {
    return of(ROOMS);
  }

  constructor() { }
}
