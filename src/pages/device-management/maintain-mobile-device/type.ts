export interface DeviceItem {
  dvcRgId: string;
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  deviceRegistrationStatus: string;
  deviceLockStatus: string;
  deviceEnableStatus: string;
  associatedUser: string;
  associatedUserEmail: string;
  associatedUserTenant: string;
  appVersion: string;
  deviceRegistrationStatusLabel: string;
  deviceLockStatusLabel: string;
  deviceEnableStatusLabel: string;
}

export interface PropsType {
  method: string;
  init?: DeviceItem;
}

export interface DeviceSearchParams {
  appVersion?: string;
  associatedUser?: string;
  associatedUserEmail?: string;
  associatedUserTenant?: string;
  deviceEnableStatus?: string;
  deviceId?: string;
  deviceLockStatus?: string;
  deviceModel?: string;
  deviceRegistrationStatus?: string;
  deviceVersion?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
}
