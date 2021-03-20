import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../models/score';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService extends BaseHttpService {

  private apiUrl =  this.baseApiURL + '/api/Scores'
  constructor(private http: HttpClient) {
    super();
  }

  public submitScore(scoreData: Score): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, scoreData);
  }
}
