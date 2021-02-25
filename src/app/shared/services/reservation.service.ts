import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { ReservationDTO } from '../models/reservationDTO';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseHttpService {
  private apiUrl =  this.baseApiURL + '/api/Reservations'
  constructor(private http: HttpClient) {
    super();
  }

  public getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl)
  }
}
