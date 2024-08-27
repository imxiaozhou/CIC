export type SearchMessageUsageParams = SearchCommonParams & {
  tenantName: string;
  email: string;
};

export interface SearchMessageUsageResponse {
  key: string;
  tenantName: string;
  displayName: string;
  email: string;
}

export interface DetailManageMessageParams {
  email: string;
  periodFromToDate: string[];
}

export interface DetailManageMessageResponse {
  successMessageSent: number;
  successMessageReceived: number;
  failedMessageSent: number;
  failedMessageReceived: number;
  totalSize: string;
}
