import { User } from "./user";

export class ReservationDTO {
    reservationId: string;
    userId: string;
    standingReservationId: string;
    resevationNumber: number;
    numberOfPlayers: number;
    startDate: Date;
    endDate: Date;
    notes: string;
    createdBy: string;
    createdDateTime: Date;
    lastModifiedBy: string;
    lastModifiedDateTime: Date;
    isApproved: boolean;
    approvedBy: string;
    standingReservationNumber: number;
    isStanding: boolean;
    user: User
}