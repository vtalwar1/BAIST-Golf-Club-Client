import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Score } from 'src/app/shared/models/score';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services';
import { ReservationService } from 'src/app/shared/services/reservation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ScoreService } from 'src/app/shared/services/score.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-submit-scores',
  templateUrl: './submit-scores.component.html',
  styleUrls: ['./submit-scores.component.scss']
})
export class SubmitScoresComponent implements OnInit {

  public isMembershipNumberDisabled: boolean = true;
  public disableDatePlayed: boolean = false;
  private currentUser: User = new User();
  public scoreData: Score = new Score();
  public loading: boolean = false;
  public asyncMessageString: string;
  public editorOptions: any = {
    readOnly: 'true'
  };
  public submitButtonOptions: any = {
    text: "Submit",
    type: "success",
    useSubmitBehavior: true
};
  constructor(private authService: AuthService,
    private reservationService: ReservationService,
    private userService: UserService,
    private location: Location,
    private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser().data as User;
    if(!this.currentUser.isStaff) {
      this.scoreData.user = this.currentUser;
      this.isMembershipNumberDisabled = true;
    } else {
      this.isMembershipNumberDisabled = false;
    }
    this.editorOptions = {
      readOnly: this.isMembershipNumberDisabled
    }
  }

  async onFormSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.scoreService.submitScore(this.scoreData).subscribe(result => {
      console.log(result);
      if(result)
      {
       notify({
         message: "Reservation created.",
     }, "success", 3000);
     this.reInitScoreData();

      } else {
       notify({
         message: "Reservation failed.",
     }, "error", 3000);
      }
      this.loading = false;  
     }, () => {
       notify({
         message: "Reservation failed.",
     }, "error", 3000);
       this.loading = false;
     })
    }

  reInitScoreData() {
    this.scoreData = new Score();
    if(!this.currentUser.isStaff) {
      this.scoreData.user = this.currentUser;
    }
  }

    asyncValidationMembershipNumber = (e) => {
      return new Promise((resolve) => {    
      this.userService.getUserByMembershipNumber(e.value).subscribe(result => { 
        if(result && result.membershipNumber) {     
          this.scoreData.user = result;
          resolve(true);
        } else {
          resolve(false);
        }
      },
      () => {
        resolve(false);
      })
  });    
    }

    asyncValidationReservationNumber = (e) => {
      if(this.scoreData.user && this.scoreData.user.membershipNumber) {
      if(e.value && e.value != 0) {
      return new Promise((resolve) => {    
      this.reservationService.getReservationByReservationNumber(e.value, this.scoreData.user.membershipNumber).subscribe(result => { 
        if(result) {  
          if(result.score && result.score.length > 0) {
            this.asyncMessageString = "Scores are already submitted for this reservation";
            this.disableDatePlayed = false;
            resolve(false);
          } else { 
          if(new Date(result.startDate) < new Date()) {
            this.scoreData.reservation.resevationNumber = result.resevationNumber;
            this.scoreData.date = new Date(result.startDate);
            this.disableDatePlayed = true;
            resolve(true);
          } else {
            this.asyncMessageString = "Can not submit scores for upcoming reservations.";
            this.disableDatePlayed = false;
            resolve(false);
          }
        }
        } else {
          resolve(false);
          this.disableDatePlayed = false;
          this.asyncMessageString = "No reservation found for selected member.";
        }
      },
      () => {
        this.disableDatePlayed = false;
        resolve(false);
      })
  });
  } else {
    this.disableDatePlayed = false;
    return new Promise(resolve => {
      resolve(true);
    });
  }    
} else {
  this.disableDatePlayed = false;
  this.asyncMessageString = "Enter a valid membership number first.";
  return new Promise(resolve => {
    resolve(false);
  });
}
    }

    fieldDataChanged = (e: any) => {
      this.loading = false;
      if (e.dataField === "startDate") {

      }
    }

    onScoreValueChange = (e: any) => {
      let handicap = ((e.value - 70.6) / 128 ) * 113;
      this.scoreData.handicap = Math.round(handicap);
    }

    onReservationNumberValueChange = (e: any) => {
      if(!e.value || e.value == '') {
        this.disableDatePlayed = false;
      }
    }
}
