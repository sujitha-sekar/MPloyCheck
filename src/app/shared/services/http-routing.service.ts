import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRoutingService {
  /**
   * Variable which is used to hold the url for backend connection.
   */
  private apiUrl = 'http://localhost:3000/api/';
  /**
   * Constructor which is used to inject the required services.
   * @param http used to access the methods inside it.
   */
  constructor(private http: HttpClient) { }
  /**
   * Method which is used to get the data.
   * @param url hold the navigation url.
   * @returns containing the result of the get methods.
   */
  getMethod<T>(url: string): Observable<T> {
    return this.http.get<T>(this.apiUrl + url);
  }
  /**
   * Method which is used to post the data.
   * @param url hold the navigation url.
   * @param data hold the request data. 
   * @returns containing the result of the post methods.
   */
  postMethod<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(this.apiUrl + url, data);
  }
  /**
   * Method which is used to update the data.
   * @param url hold the navigation url.
   * @param data hold the request data.
   * @returns containing the result of the update methods.
   */
  putMethod<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(this.apiUrl + url, data);
  }
  /**
   * Method which is used to delete the data.
   * @param url hold the navigation url.
   * @returns containing the result of the delete methods.
   */
  deleteMethod<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.apiUrl + url);
  }
}
