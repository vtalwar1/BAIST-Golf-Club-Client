import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxDataGridModule, DxFormModule, DxScrollViewModule } from 'devextreme-angular';
import { CreateReservationComponent } from './pages/reservation/create-reservation/create-reservation.component';
import { ReservationListComponent } from './pages/reservation/reservation-list/reservation-list.component';
import { UpdateReservationComponent } from './pages/reservation/update-reservation/update-reservation.component';
import { ApproveStandingReservationComponent } from './pages/reservation/approve-standing-reservation/approve-standing-reservation.component';
import { SubmitScoresComponent } from './pages/score/submit-scores/submit-scores.component';

const routes: Routes = [
  {
    path: 'submit-score',
    component: SubmitScoresComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'approve-standing-reservation',
    component: ApproveStandingReservationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'update-reservation',
    component: UpdateReservationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reservation-list',
    component: ReservationListComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-reservation',
    component: CreateReservationComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule, DxScrollViewModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [HomeComponent, ProfileComponent, TasksComponent]
})
export class AppRoutingModule { }
 