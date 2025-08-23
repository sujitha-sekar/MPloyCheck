import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../shared/services/http-routing.service';
import { delay, Observable } from 'rxjs';
import { User, Record, GetRecordResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpRoutingService) {}

  private currentUser: any;

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    return this.currentUser;
  }
  
  getUserDetails(userId: string): Observable<GetRecordResponse> {
    return this.http.getMethod<GetRecordResponse>(`user-details?id=${userId}`);
  }

  getRecords(userId: string, delayMs: number = 0): Observable<GetRecordResponse> {
    return this.http.getMethod<GetRecordResponse>(`records?id=${userId}&delay=${delayMs}`).pipe(
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