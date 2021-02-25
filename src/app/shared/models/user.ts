import { Membership } from "./membership";

export class User {
    userId: string;
    membershipNumber: number;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    isStaff: boolean;
    membership: Membership;
    fullName: string;
}