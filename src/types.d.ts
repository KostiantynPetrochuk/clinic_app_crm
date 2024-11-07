// types.d.ts
declare global {
  interface CrmUser {
    id: number;
    phoneCountryCode: string;
    phoneNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    roles: string[];
    access: boolean;
  }

  interface Filial {
    id: number;
    region: string;
    city: string;
    address: string;
    phone: string;
  }

  interface Doctor {
    id: number;
    filialId: number;
    lastName: string;
    firstName: string;
    middleName: string;
    createdAt: string;
    updatedAt: string;
  }
}

export {};
