export interface Limit {
  number: number;
  unit: string;
}
export interface LimitID {
  id: string;
}
export interface AdjustMessageStorageQuotaGroupParams {
  selectdGroup?: LimitID[];
  warningLevel?: Limit;
  cannotSendLimit?: Limit;
  cannotReceiveLimit?: Limit;
}

export interface SearchEmailGroupParams {
  pageNum: number;
  pageSize: number;
  sortOrder: number;
  emailGroupName?: string;
  userRole?: string;
  groupStatus?: string;
  tenantName?: string;
}
