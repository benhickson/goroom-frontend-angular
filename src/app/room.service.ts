import { Injectable } from '@angular/core';
import { Room } from './room';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomsUrl = `${environment.apiUrl}/rooms`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.roomsUrl)
      .pipe(
        tap(_ => this.log('fetched rooms')),
        catchError(this.handleError<Room[]>('getRooms', []))
      );
  }

  getRoom(id: number): Observable<Room> {
    const url = `${this.roomsUrl}/${id}`;
    return this.http.get<Room>(url).pipe(
      tap(_ => this.log(`fetched room id=${id}`)),
      catchError(this.handleError<Room>(`getRoom id=${id}`))
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.roomsUrl, room, this.httpOptions).pipe(
      tap((newRoom: Room) => this.log(`added Room, id: ${newRoom.id}`)),
      catchError(this.handleError<Room>('addRoom'))
    )
  }

  updateRoom(room: Room): Observable<any> {
    return this.http.patch(`${this.roomsUrl}/${room.id}`, room, this.httpOptions).pipe(
      tap(_ => this.log(`updated room id=${room.id}`)),
      catchError(this.handleError<any>('updateRoom'))
    );
  }

  closeRoom(room: Room | number): Observable<any> {
    // make this method work regardless of whether you pass a room or an id as an argument
    const id = typeof room === 'number' ? room : room.id;
    const url = `${this.roomsUrl}/${id}`;
    return this.http.delete<Room>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted room id=${id}`)),
      catchError(this.handleError<Room>('deleteRoom'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`RoomService: ${message}`);
  }
}
