import { Component, Input, OnInit } from '@angular/core';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-one-time-reservation',
  templateUrl: './one-time-reservation.component.html',
  styleUrls: ['./one-time-reservation.component.scss']
})
export class OneTimeReservationComponent implements OnInit {

  @Input() reservationData: Reservation; 
  @Input() isNew: Boolean; 
  
  constructor() { }

  ngOnInit(): void {
  }

}
