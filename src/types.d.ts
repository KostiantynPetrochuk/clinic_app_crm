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

  interface Patient {
    id: number;
    filialId: number;
    phoneCountryCode: string;
    phoneNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: {
      Time: string;
      Valid: boolean;
    };
    placeOfResidence: string;
    sex: string;
    passportSeries: string;
    passportNumber: string;
    idCardNumber: string;
    placeOfWork: string;
    position: string;
    clientType: string;
    cityOfResidence: string;
    createdAt: string;
    updatedAt: string;
  }
}

export {};
