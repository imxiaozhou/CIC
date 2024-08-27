export type MobileDeviceLogParams = SearchCommonParams & {
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  mobileLogUploadTime: string;
};

export interface MobileDeviceLogResponse {
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  dvcLogId: string;
  uploadBy: string;
  uploadDt: string;
}

export type downloadMobileDeviceLogParams = {
  key: string;
};
