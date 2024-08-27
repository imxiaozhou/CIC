export type UserLogonParams = SearchCommonParams & {
  tenantName: string;
  deviceType: string;
  displayName: string;
  ip: string;
};

export interface SerLogonResponse {
  key: string;
  tenantName: string;
  logonTime: string;
  duration: string;
  displayName: string;
  deviceType: string;
  mobileId: string;
  ip: string;
}
