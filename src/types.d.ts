// types.d.ts
declare global {
  interface CrmUser {
    id: number;
    phoneCountryCode: string;
    phoneNumber: string;
    //   password: string;
    lastName: string;
    firstName: string;
    middleName: string;
    roles: string[];
    access: boolean;
  }
}

export {};
