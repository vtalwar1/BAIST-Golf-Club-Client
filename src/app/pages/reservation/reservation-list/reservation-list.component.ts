import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Reservation } from '../../../shared/models/reservation';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../shared/services';
import { ReservationService } from '../../../shared/services/reservation.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  private currentUser: User = new User();
  public dataSource: any;
  public reservationList: Reservation[];
  constructor(private authService: AuthService, private reservationService: ReservationService
    ,private location: Location
    ,private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser().data as User;
    this.dataSource = new DataSource({
      key: "reservationId",
      load: () => this.reservationService.getAllReservationsByUser(this.currentUser.userId).toPromise()
        .then((data) => {
          this.reservationList = data;
          return {
            data: data,
          }
        })
    })
  }

  fullNameColumn_calculateCellValue (rowData) {
    return rowData.user.firstName + " " + rowData.user.lastName;
}

reservationStatus_calculateCellValue = (rowData) => {
  return this.getReservationStatus(rowData.startDate);
}

getReservationStatus(reservationStartDate: Date): string {
  let currentDate = new Date();
  if(new Date(reservationStartDate) < currentDate) {
    return "Past";
  } else {
    return "Upcoming";
  }
}

startEdit = (e) => {
  if(e.data.startDate) {
  if(this.getReservationStatus(e.data.startDate) == "Upcoming") {
    let reservationId = e.data.reservationId;
    this.router.navigateByUrl("/update-reservation?reservationId=" + reservationId);
  } else {
    notify({
      message: "Can not modify past reservations",
  }, "error", 3000);
  }
  }
}

}
