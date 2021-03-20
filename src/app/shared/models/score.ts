import { Reservation } from "./reservation";
import { User } from "./user";

export class Score {
    scoreId: string;
    userId: string;
    reservationId: string;
    date: Date;
    totalScore: number;
    handicap: number;

    reservation: Reservation;
    user: User;
}