import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { CreateReservationComponent } from './pages/reservation/create-reservation/create-reservation.component';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxSelectBoxComponent, DxSelectBoxModule } from 'devextreme-angular';
import { OneTimeReservationComponent } from './shared/components/one-time-reservation/one-time-reservation.component';
import { StandingReservationComponent } from './shared/components/standing-reservation/standing-reservation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReservationListComponent } from './shared/components/reservation-list/reservation-list.component';
import { UpdateReservationComponent } from './shared/components/update-reservation/update-reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateReservationComponent,
    OneTimeReservationComponent,
    StandingReservationComponent,
    ReservationListComponent,
    UpdateReservationComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    DxFormModule,
    DxSelectBoxModule,
    HttpClientModule,
    DxButtonModule,
    DxDataGridModule,
  ],
  providers: [AuthService, ScreenService, AppInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
