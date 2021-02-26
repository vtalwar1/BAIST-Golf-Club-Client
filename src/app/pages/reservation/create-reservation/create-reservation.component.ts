import { Component, OnInit } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Reservation } from 'src/app/shared/models/reservation';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.scss']
})
export class CreateReservationComponent implements OnInit {

public reservationData: Reservation;
public reservationTypeDisabled: boolean = true;
public reservationTypeSelectedValue: string;
public isStanding: boolean = false;
public user: User;
public isNew: boolean = true;
  constructor(private authService: AuthService) {
   }
  
  ngOnInit(): void {
    this.reservationData = new Reservation();
    this.user = this.authService.getUser().data;
    this.reservationTypeDisabled = !(this.user.isStaff || this.user.membership.membershipType === "Shareholder");
    if(this.reservationTypeDisabled)
      this.reservationTypeSelectedValue = "O";
  }
}
