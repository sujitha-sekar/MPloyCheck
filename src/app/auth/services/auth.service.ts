import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../shared/services/http-routing.service';
import { LoginInput, LoginResponse } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Service constructor which is used to load auth details.
   * @param http to use the functions in httpRoutingService Service.
   */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method which is used to login.
   * @param data holds the login credentials.
   * @returns contain the result of login.
   */
  login(data: LoginInput): Observable<LoginResponse> {
    return this.http.postMethod('auth/login', data) as Observable<LoginResponse>;
  }
}
