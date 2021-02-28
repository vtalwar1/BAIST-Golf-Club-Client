import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
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
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
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
  this.loading = true;
  console.log(e, data);
  data.data.approvedBy = this.currentUser.userId;

  this.reservationService.approveStandingReservation(data.data).subscribe(result => {
    if(result) {
      this.grid.instance.refresh();
      notify({
        message: "Standing Reservation Approved.",
    }, "error", 3000);
    } else {
      notify({
        message: "Standing Reservation Approval failed.",
    }, "error", 3000);
    }
    this.loading = false;
  }, error => {
    this.loading = false;
    notify({
      message: "Standing Reservation Approval failed.",
  }, "error", 3000);
  });
}

}
