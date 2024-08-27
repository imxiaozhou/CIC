export interface EnquireColumnsInterface {
  id: string;
  tenantName: string;
  userName: string;
  displayName: string;
  email: string;
}

export interface MessageUsageDetailsColumns {
  successMessageSent: number;
  successMessageReceived: number;
  failedMessageSent: number;
  failedMessageReceived: number;
  totalSize: string;
}

export interface StarAndEndDateInterface {
  email: string;
  periodFromToDate: string[];
}
