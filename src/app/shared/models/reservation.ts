import { Score } from "./score";
import { StandingReservation } from "./standing-reservation";
import { User } from "./user";

export class Reservation {

    constructor() {
        this.user = new User();
        }

    reservationId?: string;
    userId?: string;
    standingReservationId?: string;
    resevationNumber?: number;
    numberOfPlayers?: number = 1;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    createdBy?: string;
    createdDateTime?: Date;
    lastModifiedBy?: string;
    lastModifiedDateTime?: Date;
    cartRequired: boolean;

    standingReservation?: StandingReservation;
    user?: User;
    score?: Score[];
}