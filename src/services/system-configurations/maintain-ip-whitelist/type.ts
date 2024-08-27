export type MaintainIpWhiteParams = SearchCommonParams;

export type MaintainIpWhiteDelParams = {
  id: string;
  userId: string;
};

export interface MaintainIpWhiteResponse {
  id: string;
  ipAddress: string;
  remark: string;
  status: boolean | string;
  statusLabel: string;
  userId: string;
}

export interface MaintainIpWhiteUpdateParams {
  id?: string;
  ipAddress: string;
  remark: string;
  status: boolean | string;
  userId?: string;
  statusLabel?: string;
}
