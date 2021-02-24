import { Reservation } from "./reservation";
import { User } from "./user";

export interface StandingReservation {
    standingReservationId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
    isApproved: boolean
    approvedBy?: string,
    createdBy: string,
    createdDateTime: string,
    lastModifiedBy?: string,
    lastModifiedDateTime?: string,
    standingReservationNumber: number,

    approvedByUser?: User,
    user: User
    reservations?: Reservation[]
}