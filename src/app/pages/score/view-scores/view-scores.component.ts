import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Score } from 'src/app/shared/models/score';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services';
import { ScoreService } from 'src/app/shared/services/score.service';

@Component({
  selector: 'app-view-scores',
  templateUrl: './view-scores.component.html',
  styleUrls: ['./view-scores.component.scss']
})
export class ViewScoresComponent implements OnInit {

  private currentUser: User = new User();
  public dataSource: any;
  public scoreList: Score[];
  constructor(private authService: AuthService, private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser().data as User;
    this.dataSource = new DataSource({
      key: "scoreId",
      load: () => this.scoreService.getAllScoresByUser(this.currentUser.userId).toPromise()
        .then((data) => {
          this.scoreList = data;
          return {
            data: data,
          }
        })
    });
  }

  fullNameColumn_calculateCellValue (rowData) {
    return rowData.user.firstName + " " + rowData.user.lastName;
}

handicap_calculateCellValue (rowData) {
  return Math.round(rowData.handicap);
}
}
