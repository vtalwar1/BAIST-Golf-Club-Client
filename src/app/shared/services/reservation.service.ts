import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reservation } from '../models/reservation';
import { ReservationDTO } from '../models/reservationDTO';
import { StandingReservation } from '../models/standing-reservation';
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

  public getReservationById(reservationId: any): Observable<ReservationDTO> {
    return this.http.get<ReservationDTO>(this.apiUrl + '/GetReservationById/' + reservationId).pipe(tap((result) => {
      if (result != null) {
        result.user.fullName = result.user.firstName + ' ' + result.user.lastName;
        result.startDate = new Date(result.startDate);
        result.endDate = new Date(result.endDate);
        result.createdDateTime = new Date(result.createdDateTime);
      }
    }));
  }

  public createReservation(reservationData: ReservationDTO, isStanding: boolean): Observable<boolean> {
    if(isStanding)
      reservationData.reservationType = "S";
    else 
      reservationData.reservationType = "O";
    return this.http.post<boolean>(this.apiUrl, reservationData);
  }

  public updateReservation(reservationData: ReservationDTO): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrl + '/' + reservationData.reservationId, reservationData);
  }

  public getAllStandingReservationsForApproval(activeOnly: boolean): Observable<StandingReservation[]> {
    return this.http.get<StandingReservation[]>(this.apiUrl + '/GetAllStandingReservationsForApproval/' + activeOnly)
  }


}
