import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationDTO } from '../../../shared/models/reservationDTO';
import { ReservationService } from '../../../shared/services/reservation.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss']
})
export class UpdateReservationComponent implements OnInit {

  public reservationId: string;
  public reservationData: ReservationDTO;
  public isValid: boolean = false;
  public isNew: boolean = false;
  constructor(private _route: ActivatedRoute, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(map => {
      this.reservationId = map.reservationId != undefined ? map.reservationId : undefined;

      this.reservationService.getReservationById(this.reservationId).subscribe(result => {
        if(!result){
          this.isValid = false;
        } else {
          this.isValid = true;
          this.reservationData = result;
        }
      },
      error => {
        this.isValid = false;
      })
    });
  }

}
