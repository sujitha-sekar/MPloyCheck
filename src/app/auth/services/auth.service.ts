import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../shared/services/http-routing.service';
import { LoginInput, LoginResponse } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpRoutingService) { }

  login(data: LoginInput): Observable<LoginResponse> {
    return this.http.postMethod('auth/login', data) as Observable<LoginResponse>;
  }
}
