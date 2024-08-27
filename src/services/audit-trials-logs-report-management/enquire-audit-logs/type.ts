export type AuditLogsParams = SearchCommonParams & {
  tenantName: string;
  userEmail: string;
  delegateUserEmail: string;
  delegationDate: string[];
  ipAddress: string;
  eventType: string;
};

export interface AuditLogsResponse {}

export interface AuditLogsDetailParams {
  id: string;
}

export interface AuditLogsDetailResponse {
  tenantName: string;
  userEmail: string;
  delegateUserEmail: string;
  time: string;
  ipAddress: string;
  eventType: string;
  eventTypeLabel: string;
  detail: {
    key: string;
    value: string;
  }[];
}
