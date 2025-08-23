import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../shared/services/http-routing.service';
import { delay, Observable } from 'rxjs';
import { User, GetRecordResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Constructor which is used to inject the required services.
   * @param http used to access the methods inside it.
   */
  constructor(private http: HttpRoutingService) {}
  /**
   * Variable which is used to hold current user data.
   */
  private currentUser: any;
  /**
   * Method which is used to set the current user in local storage.
   * @param user hold the user data.
   */
  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  /**
   * Method which is used to get the current user data.
   * @returns current user info.
   */
  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    return this.currentUser;
  }
  /**
   * Methods which is used to get a user details.
   * @param userId hold the user id.
   * @returns contain the result of user details.
   */
  getUserDetails(userId: string): Observable<GetRecordResponse> {
    return this.http.getMethod<GetRecordResponse>(`user-details?id=${userId}`);
  }
  /**
   * Method which is used to get the user record.
   * @param userId hold the user id.
   * @param delayMs hold the delay time.
   * @returns contain the result of user record details.
   */
  getRecords(userId: string, delayMs: number = 0): Observable<GetRecordResponse> {
    return this.http.getMethod<GetRecordResponse>(`records?id=${userId}&delay=${delayMs}`).pipe(
      delay(delayMs)
    );
  }
  /**
   * Method which is used to get the list of users.
   * @param delayMs hold the delay time.
   * @returns contain the result of all user details.
   */
  getAllUsers(delayMs: number = 0): Observable<User[]> {
    return this.http.getMethod<User[]>(`users?delay=${delayMs}`).pipe(
      delay(delayMs)
    );
  }
  /**
   * Method which is used to create a new user.
   * @param user hold the user details.
   * @returns contain the result of the create user.
   */
  addUser(user: User): Observable<User> {
    return this.http.postMethod<User>('users', user);
  }
  /**
   * Method which is used to update a user details.
   * @param user hold the user details.
   * @returns contain the result of the update user.
   */
  updateUser(user: User): Observable<User> {
    return this.http.putMethod<User>(`users/${user.id}`, user);
  }
  /**
   * Method which is used ot delete the user.
   * @param userId hold the user id.
   * @returns contan the result of the delete user.
   */
  deleteUser(userId: string): Observable<void> {
    return this.http.deleteMethod<void>(`users/${userId}`);
  }
}