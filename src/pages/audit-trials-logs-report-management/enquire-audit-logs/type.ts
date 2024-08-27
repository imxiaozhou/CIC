export interface IAuditLogs {
  id: string;
  tenantName: string;
  emailAddress: string;
  userEmail: string;
  delegateUserEmail: string;
  time: string;
  delegationFrom: string;
  delegationTo: string;
  ipAddress: string;
  eventType: string;
  eventTypeLabel: string;
}

export interface ICsvData {
  tenantName: string;
  emailAddress: string;
  delegateUserEmail: string;
  time: string;
  ipAddress: string;
  eventType: string;
  eventTypeLabel: string;
}

export interface DataType {
  key: React.Key;
  value: string;
}
