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

export interface SearchResponse {
  rm: number;
  userId: string;
  displayName: string;
  warningLevel?: any;
  sendLimit?: any;
  receiveLimit?: any;
  emailAddress: string;
  tenantName?: any;
  emailGroup?: any;
  userRole?: any;
  userStatus: string;
  accountStatus: string;
  userStatusLabel?: any;
  accountStatusLabel?: any;
}

export interface Limit {
  [key: string]: string;
}

export interface MessageStorageQuotaOParams {
  userIds: string[];
  warningLevel: Limit;
  sendLimit: Limit;
  receiveLimit: Limit;
}
