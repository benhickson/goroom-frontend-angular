import { Injectable } from '@angular/core';
import { Room } from './room'
import { ROOMS } from './mock-rooms'
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  getRooms(): Observable<Room[]> {
    this.messageService.add('RoomService: fetched rooms')
    return of(ROOMS);
  }

  getRoom(id: number): Observable<Room> {
    // TODO: send the message after fetching the hero
    this.messageService.add(`RoomService: fetched room id=${id}`);
    return of(ROOMS.find(room => room.id === id));
  } 

  constructor(private messageService: MessageService) { }
}
