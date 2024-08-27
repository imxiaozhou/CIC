export interface MaintainUserSettingItem {
  key: string;
  displayName: string;
  warningLevel: string;
  sendLimit: string;
  receiveLimit: string;
  emailAddress: string;
  emailGroup: string;
  userRole: string;
  tenantName: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
  userId: string;
}

export interface TagColorMap {
  [key: string]: string;
}
