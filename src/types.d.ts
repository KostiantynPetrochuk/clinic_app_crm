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

  interface Application {
    id: number;
    patientId: number;
    filialId: number;
    startDateTime: string;
    endDateTime: string;
    description: string;
    status: string;
    cancelUserId: {
      Int64: number;
      Valid: boolean;
    };
    cancelReason: {
      String: string;
      Valid: boolean;
    };
    canceledAt: {
      Time: string;
      Valid: boolean;
    };
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName: string;
    createdAt: string;
    updatedAt: string;
  }
  interface Appointment {
    id: number;
    doctorId: number;
    creatorId: number;
    aReporterId: {
      Int64: number;
      Valid: boolean;
    };
    diagnosisAdderId: {
      Int64: number;
      Valid: boolean;
    };
    filialId: number;
    patientId: number;
    serviceType: string;
    recordType: string;
    sourceOfInfo: string;
    startDateTime: string;
    endDateTime: string;
    price: number;
    status: string;
    consentForTreatment: boolean;
    consentForDataProcessing: boolean;
    paymentType: {
      String: string;
      Valid: boolean;
    };
    diagnosis: {
      String: string;
      Valid: boolean;
    };
    recommendations: {
      String: string;
      Valid: boolean;
    };
    comment: {
      String: string;
      Valid: boolean;
    };
    cancelReason: {
      String: string;
      Valid: boolean;
    };
    createdAt: string;
    updatedAt: string;
    //
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName: string;
  }
}

export {};
