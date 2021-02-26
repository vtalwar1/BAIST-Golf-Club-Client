import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { StandingReservation } from 'src/app/shared/models/standing-reservation';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services';
import { ReservationService } from 'src/app/shared/services/reservation.service';

@Component({
  selector: 'app-approve-standing-reservation',
  templateUrl: './approve-standing-reservation.component.html',
  styleUrls: ['./approve-standing-reservation.component.scss']
})
export class ApproveStandingReservationComponent implements OnInit {
  private currentUser: User = new User();
  public dataSource: any;
  public standingReservationList: StandingReservation[];
  public loading: boolean = false;
  constructor(private authService: AuthService, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser().data as User;
    this.dataSource = new DataSource({
      key: "standingReservationId",
      load: () => this.reservationService.getAllStandingReservationsForApproval(true).toPromise()
        .then((data) => {
          this.standingReservationList = data;
          return {
            data: data,
          }
        })
    });
  }

  fullNameColumn_calculateCellValue (rowData) {
    return rowData.user.firstName + " " + rowData.user.lastName;
}

approveButtonClick = (e, data) => {
  console.log(e, data);
  this.loading = true;
  setTimeout(() => {
    this.loading = false;
  }, 5000);
}

}
