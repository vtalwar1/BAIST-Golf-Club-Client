import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  private apiUrl =  this.baseApiURL + '/api/Users'
  constructor(private http: HttpClient) {
    super();
  }

  public getUserByEmail(email:string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/GetUserByEmail/' + email)
  }

  public getUserById(id:string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/' + id)
  }
}
