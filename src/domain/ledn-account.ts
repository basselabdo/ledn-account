export interface LednAccount {
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    dob: string;
    mfa?: MFA;
    amt: number;
    createdDate: string;
    referredBy?: string;
}
export enum MFA {
    SMS = 'SMS',
    TOTP = 'TOTP'
}

export interface AccountSearchCriteria {
    country?: string;
    mfa?: string;
    name?: string;
    sortField?: keyof LednAccount;
}
