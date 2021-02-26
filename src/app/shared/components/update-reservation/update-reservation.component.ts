import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss']
})
export class UpdateReservationComponent implements OnInit {

  public reservationId: string
  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(map => {
      this.reservationId = map.reservationId != undefined ? map.reservationId : undefined;
    });
  }

}
