import request from '@/services/axios';
import { MobileDeviceLogParams, MobileDeviceLogResponse } from './type';

const baseUrl = '/sma-adm/api/mgt/dvm/';

export const getMobileDeviceLog = async (params: MobileDeviceLogParams) => {
  const res = await request.post<
    MobileDeviceLogParams,
    MobileDeviceLogResponse[]
  >(`${baseUrl}search-mobile-device-log-list`, params);
  return res.payload;
};

export const downloadMobileDeviceLog = async (key: string) => {
  const res = await request.download(
    `${baseUrl}download-mobile-device-log?dvcLogId=${key}`,
    {}
  );
  return res;
};
