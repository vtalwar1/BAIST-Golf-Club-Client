import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { DxSelectBoxComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { ReservationDTO } from '../../models/reservationDTO';
import { User } from '../../models/user';
import { AuthService } from '../../services';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';

const MIN_START_TIME = 9,
  MAX_END_TIME = 20,
  MAX_TIME_GAME = 2,
  MAX_END_WEEKS_STANDING = 4,
  MIN_START_TIME_SILVER_WEEKEND = 11,
  MIN_START_TIME_BRONZE_WEEKEND = 13,
  MIN_START_TIME_SILVER_WEEKDAY1 = 15,
  MIN_START_TIME_SILVER_WEEKDAY2 = 17.5,
  MIN_START_TIME_BRONZE_WEEKDAY1 = 15,
  MIN_START_TIME_BRONZE_WEEKDAY2 = 18;

@Component({
  selector: 'app-one-time-reservation',
  templateUrl: './one-time-reservation.component.html',
  styleUrls: ['./one-time-reservation.component.scss']
})
export class OneTimeReservationComponent implements OnInit {

  @Input() reservationData: ReservationDTO; 
  @Input() isNew: Boolean; 
  @ViewChild('selectBox', { static: false }) selectBox: DxSelectBoxComponent;
  public reservationTypes: [{
    id: "O",
    description: "One-Time Reservation",
}, {
  id: "S",
  description: "Standing Reservation",
}];


public playersDropdown = [1, 2, 3, 4];
public reservationTypeDisabled: boolean = true;
public reservationTypeSelectedValue: string = "O";
public isStanding: boolean = false;
public asyncMessageString: string;
  private currentUser: User = new User();
  public minStartDate: Date = new Date();
  public isMembershipNumberDisabled: boolean = true;

  public createButtonOptions: any = {
    text: "Create",
    type: "success",
    useSubmitBehavior: true
};

public updateButtonOptions: any = {
  text: "Update",
  type: "success",
  useSubmitBehavior: true
};

public cancelButtonOptions: any;
public editorOptions: any = {
  readOnly: 'true'
};

public loading: boolean = false;
  constructor(private authService: AuthService, private reservationService: ReservationService, private userService: UserService, private location: Location) {
    this.reservationTypes = [{
      id: "O",
      description: "One-Time Reservation",
  }, {
    id: "S",
    description: "Standing Reservation",
  }];
   }
  ngOnInit(): void {
    this.currentUser = this.authService.getUser().data as User;
    if(!this.currentUser.isStaff && this.isNew) {
      this.reservationData.user = this.currentUser;
    }
    
      if (!this.isNew) {
      this.isMembershipNumberDisabled = true;
      this.reservationTypeDisabled = true;
      this.editorOptions = {
        readOnly: this.isMembershipNumberDisabled
      }
    } else {

      this.reservationTypeDisabled = !(this.currentUser.isStaff || this.currentUser.membership.membershipType === "Shareholder");
    if(this.reservationTypeDisabled) {
      this.reservationTypeSelectedValue = "O";
      this.selectBox.value = "O";
    }
      let date = new Date();
      this.reservationData.isStanding = this.isStanding;
      this.reservationData.startDate = new Date(date.setHours(MIN_START_TIME, 0, 0, 0));
      this.reservationData.endDate = this.addTime(this.reservationData.startDate, MAX_TIME_GAME);
      this.reservationData.numberOfPlayers = 1;
      this.reservationData.notes = "";
      this.reservationData.createdBy = this.currentUser.email;
      this.isMembershipNumberDisabled = !this.currentUser.isStaff;
      this.editorOptions = {
        readOnly: this.isMembershipNumberDisabled
      }
      
    }
    
      this.onReservationTypeValueChange =  this.onReservationTypeValueChange.bind(this);

      this.cancelButtonOptions = {
        text: "Cancel",
        type: "danger",
        useSubmitBehavior: false,
        onClick: this.onCancelClick,
      }
  }

  onReservationTypeValueChange = (e) => {
    this.isStanding = e.value == "S";
    if(this.isStanding) {
      this.reservationData.numberOfPlayers = 1;
      this.reservationData.endDate = this.addWeeks(this.reservationData.startDate, MAX_END_WEEKS_STANDING);
    }
    else {
      this.reservationData.endDate = this.addTime(this.reservationData.startDate, MAX_TIME_GAME);
    }
  }

  timeValidation = (data: any) => {
    
      let time = (new Date(data.value)).getHours();
      let selectedDate = (new Date(data.value));
      console.log(selectedDate.getDay());
      let currentTime = (new Date());
      if (MIN_START_TIME > time || MAX_END_TIME < time) {
        data.rule.message = "This time is unavailable. Opening hours 09:00 AM - 7:00 PM";
        return false;
      } else if (data.value.getDate() === currentTime.getDate() ) {
        if(data.value.getHours() < currentTime.getHours()) {
        data.rule.message = "Can not select the time in past";
        return false;
        } else {          
          return true
        }
      } else {
        if(this.reservationData.user){
        // Check for membership
        if(this.reservationData.user.membership && this.reservationData.user.membership.membershipType === "Silver") {
          if(selectedDate.getDay() == 0 || selectedDate.getDay() == 6) {
            if(time <= MIN_START_TIME_SILVER_WEEKEND) {
              data.rule.message = "Silver Member can only reserve for after 11:00 AM on Weekends";
              return false;
            } else {
              return true;
            }
          } else {
            if(time >= MIN_START_TIME_SILVER_WEEKDAY1 && time <= MIN_START_TIME_SILVER_WEEKDAY2) {
              data.rule.message = "Silver Member can only reserve for before 3:00 PM and after 5:30 PM on Weekdays";
              return false;
            } else {
              return true;
            }
          }
        } else if (this.reservationData.user.membership && this.reservationData.user.membership.membershipType === "Bronze") {
          if(selectedDate.getDay() == 0 || selectedDate.getDay() == 6) {
            if(time <= MIN_START_TIME_BRONZE_WEEKEND) {
              data.rule.message = "Bronze Member can only reserve for after 1:00 PM on Weekends";
              return false;
            } else {
              return true;
            }
          } else {
            if(time >= MIN_START_TIME_BRONZE_WEEKDAY1 && time <= MIN_START_TIME_BRONZE_WEEKDAY2) {
              data.rule.message = "Bronze Member can only reserve for before 3:00 PM and after 6:00 PM on Weekdays";
              return false;
            } else {
              return true;
            }
          }
        }
        return true;
      }else {
        return true;
      }
    } 
  }

  asyncValidationTimeSlot = () => {
    var isValid = false;
    if(!this.isStanding) {
    return new Promise((resolve) => {
      
      this.reservationService.getAllReservations(true).subscribe(result => {
        if(this.isNew) {
          if(this.reservationData.user && result.filter(x => x.userId == this.reservationData.user.userId).length >= 4 ) {
            isValid = false;
            this.asyncMessageString = "Maximum of 4 active reservations are allowed per user"
          }
          else if(this.reservationData.user && result.find(x => (new Date(x.startDate).toLocaleDateString() == this.reservationData.startDate.toLocaleDateString()) && x.userId == this.reservationData.user.userId))
          {
            isValid = false;
            this.asyncMessageString = "Reservation already exists for this date. Please select another date."
  
          }
          else{
            var playersCount = 0;
            result.forEach(x => {
              if(new Date(x.startDate).toISOString() == this.reservationData.startDate.toISOString()) {
                playersCount = playersCount + x.numberOfPlayers;
              }
            });
            isValid = (playersCount + this.reservationData.numberOfPlayers) <= 4;
            if(!isValid) {
            if(playersCount < 4 ) {
              var slotLeft = 4 - playersCount;
              this.asyncMessageString = "Only " + slotLeft + " players are avaiable to select."
            }else {
              this.asyncMessageString = "Time slot is not available"
            }
          }
          }
  
          resolve(isValid);
        }  else {
          var playersCount = 0;
            result.filter(x => x.reservationId != this.reservationData.reservationId).forEach(x => {
              if(new Date(x.startDate).toISOString() == this.reservationData.startDate.toISOString()) {
                playersCount = playersCount + x.numberOfPlayers;
              }
            });
            isValid = (playersCount + this.reservationData.numberOfPlayers) <= 4;
            if(!isValid) {
            if(playersCount < 4 ) {
              var slotLeft = 4 - playersCount;
              this.asyncMessageString = "Only " + slotLeft + " players are avaiable to select."
            }else {
              this.asyncMessageString = "Time slot is not available"
            }
          }

          resolve(isValid);
        }
      },
      () => {
        isValid = true;
        resolve(true);
      })
  });  } else
  {
    return new Promise((resolve) => {

      this.reservationService.getAllStandingReservationsForApproval(true).subscribe(x=>{
        if(this.reservationData.user && x.filter(y => y.user.email.toLowerCase() == this.reservationData.user.email.toLowerCase()).length > 0){
          isValid = false;
          this.asyncMessageString = "One active standing reservation already exists."
        } else {
          isValid = true;
        }

        resolve(isValid);
      }, e => {
        resolve(false);
      });

    });
  }  

    }

    asyncValidationMembershipNumber = (e) => {
      return new Promise((resolve) => {    
      this.userService.getUserByMembershipNumber(e.value).subscribe(result => { 
        if(result && result.membershipNumber) {     
          this.reservationData.user = result;
          if(result.membership.membershipType != "Shareholder"){
            this.reservationTypeSelectedValue = "O";
            this.selectBox.value = "O";
            this.reservationTypeDisabled = true;
          } else {
            this.reservationTypeDisabled = false;
          }
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

  addTime(value: Date, time: number) {
    var date = new Date(value.toString());
    return new Date(date.setHours(date.getHours() + time));
  }
  addWeeks(date: Date, weeks: number) {
    let result = new Date(date.toString());
    result.setDate(result.getDate() + weeks * 7);
    return result;
  }
  fieldDataChanged = (e: any) => {
    this.loading = false;
    if (e.dataField === "startDate") {
      if(!this.isStanding) {
        this.reservationData.endDate = this.addTime(e.value, MAX_TIME_GAME);
        this.reservationData.startDate = e.value;
      }
      else {
        this.reservationData.endDate = this.addWeeks(e.value, MAX_END_WEEKS_STANDING);
        this.reservationData.startDate = e.value;
      }
    }
  }

  async onFormSubmit(e) {
    e.preventDefault();
    this.loading = true;
    if(this.isNew) {
      this.reservationService.createReservation(this.reservationData, this.isStanding).subscribe(result => {
       console.log(result);
       if(result)
       {
        notify({
          message: "Reservation created.",
      }, "success", 3000);
      this.reInitReservationData();

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
    } else {
      this.reservationData.lastModifiedBy = this.currentUser.email;
      this.reservationService.updateReservation(this.reservationData).subscribe(result => {
        console.log(result);
        if(result)
        {
         notify({
           message: "Reservation updated.",
       }, "success", 3000); 
        } else {
         notify({
           message: "Reservation update failed.",
       }, "error", 3000);
        }
        this.loading = false;  
       }, () => {
         notify({
           message: "Reservation update failed.",
       }, "error", 3000);
         this.loading = false;
       })
    }
}
  reInitReservationData() {
    this.reservationData = new ReservationDTO();
    let date = new Date();
    this.reservationData.isStanding = this.isStanding;
    this.reservationData.startDate = new Date(date.setHours(MIN_START_TIME, 0, 0, 0));
    this.reservationData.endDate = this.addTime(this.reservationData.startDate, MAX_TIME_GAME);
    this.reservationData.numberOfPlayers = 1;
    this.reservationData.notes = "";
    this.reservationData.createdBy = this.currentUser.email;
    if(!this.currentUser.isStaff) {
      this.reservationData.user = this.currentUser;
    }
  }

onCancelClick = (e) => {
  console.log(e);
  this.location.back();
}
}
