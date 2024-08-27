export type SearchParams = SearchCommonParams & {
  displayName?: string;
  warningLevel?: string;
  cannotSendLimit?: string;
  cannotReceiveLimit?: string;
  emailAddress?: string;
  emailGroup?: string;
  userRole?: string;
  tenantName?: string;
  userStatus?: string;
  accountStatus?: string;
};

export interface Limit {
  [key: string]: string;
}

export interface MessageStorageQuotaOParams {
  userIds: string[];
  maxRecipients: string;
  predefinedPeriod: string;
  maxEmail: string;
}
