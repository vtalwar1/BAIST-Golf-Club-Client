import { TranslationWidth } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DxSelectBoxComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Reservation } from '../../models/reservation';
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
  constructor(private authService: AuthService, private reservationService: ReservationService, private userService: UserService) {
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
    if(!this.currentUser.isStaff) {
      this.reservationData.user = this.currentUser;
    }
    this.reservationTypeDisabled = !(this.currentUser.isStaff || this.currentUser.membership.membershipType === "Shareholder");
    if(this.reservationTypeDisabled) {
      this.reservationTypeSelectedValue = "O";
      this.selectBox.value = "O";
    }

    if (!this.isNew) {
      this.isMembershipNumberDisabled = true;
    } else {
      let date = new Date();
      this.reservationData.isStanding = this.isStanding;
      this.reservationData.startDate = new Date(date.setHours(MIN_START_TIME, 0, 0, 0));
      this.reservationData.endDate = this.addTime(this.reservationData.startDate, MAX_TIME_GAME);
      this.reservationData.numberOfPlayers = 1;
      this.reservationData.notes = "";
      this.isMembershipNumberDisabled = !this.currentUser.isStaff;
    }
    
      this.onReservationTypeValueChange =  this.onReservationTypeValueChange.bind(this);
  }

  onReservationTypeValueChange = (e) => {
    this.isStanding = e.value == "S";
    notify(e.value);
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
      } else if (data.value.getUTCDate() === currentTime.getUTCDate() ) {
        if(data.value.getUTCHours() > currentTime.getUTCHours()) {
        data.rule.message = "Can not select the time in past";
        return false;
        } else {          
          return true
        }
      } else {
        // Check for membership
        if(this.reservationData.user.membership.membershipType === "Silver") {
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
        } else if (this.reservationData.user.membership.membershipType === "Bronze") {
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
      }
  }

  asyncValidationTimeSlot = (params) => {
    var isValid = false;
    return new Promise((resolve) => {
      
      this.reservationService.getAllReservations().subscribe(result => {
        var playersCount = 0;
        result.forEach(x => {
          if(x.startDate === this.reservationData.startDate) {
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
      },
      error => {
        isValid = true;
        resolve(true);
      })
  });    

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
        }
      },
      error => {
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
  fieldDataChanged(e: any) {
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
}
