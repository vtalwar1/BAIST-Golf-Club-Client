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

  public getAllReservations(activeOnly: boolean): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl + '/' + activeOnly)
  }

  public getAllReservationsByUser(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl + '/GetAllReservationsByUserType/' + userId)
  }

  public createReservation(reservationData: ReservationDTO, isStanding: boolean): Observable<boolean> {
    if(isStanding)
      reservationData.reservationType = "S";
    else 
      reservationData.reservationType = "O";
    return this.http.post<boolean>(this.apiUrl, reservationData);
  }
}
