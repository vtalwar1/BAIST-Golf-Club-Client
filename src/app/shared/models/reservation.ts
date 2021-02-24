import { StandingReservation } from "./standing-reservation";
import { User } from "./user";

export interface Reservation {
    reservationId: string,
    userId: string,
    standingReservationId?: string,
    resevationNumber: number,
    numberOfPlayers: number,
    startDate: Date,
    endDate: Date,
    notes?: string,
    createdBy: string,
    createdDateTime: Date,
    lastModifiedBy?: string,
    lastModifiedDateTime?: Date,

    standingReservation?: StandingReservation,
    user: User
}