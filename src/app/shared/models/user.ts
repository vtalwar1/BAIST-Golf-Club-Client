import { Membership } from "./membership";

export interface User {
    userId: string,
    membershipNumber: number,
    firstName: string,
    lastName: string,
    email: string,
    active: boolean,

    membership: Membership
}