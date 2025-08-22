import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../shared/services/http-routing.service';
import { delay, Observable } from 'rxjs';
import { User, Record } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpRoutingService) {}

  getUserDetails(): Observable<User> {
    return this.http.getMethod<User>('user-details');
  }

  getRecords(userId: string, delayMs: number = 0): Observable<Record[]> {
    return this.http.getMethod<Record[]>(`records?id=${userId}&delay=${delayMs}`).pipe(
      delay(delayMs)
    );
  }

  getAllUsers(delayMs: number = 0): Observable<User[]> {
    return this.http.getMethod<User[]>(`users?delay=${delayMs}`).pipe(
      delay(delayMs)
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.postMethod<User>('users', user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.putMethod<User>(`users/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.deleteMethod<void>(`users/${userId}`);
  }
}