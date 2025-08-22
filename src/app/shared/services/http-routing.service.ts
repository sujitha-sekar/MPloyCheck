import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRoutingService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getMethod<T>(url: string): Observable<T> {
    return this.http.get<T>(this.apiUrl + url);
  }

  postMethod<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(this.apiUrl + url, data);
  }

  putMethod<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(this.apiUrl + url, data);
  }

  deleteMethod<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.apiUrl + url);
  }
}
