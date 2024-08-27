import {
  DeviceItem,
  DeviceSearchParams
} from '@/pages/device-management/maintain-mobile-device/type';
import { dvmBaseUrl } from '.';
import request from '../axios';

export const searchDeviceListApi = async (params: DeviceSearchParams) => {
  const res = await request.post<DeviceSearchParams, any>(
    `${dvmBaseUrl}maintain-mobile-device-list`,
    params
  );
  return res.payload;
};
export const saveDeviceApi = async (params: DeviceItem) => {
  const res = await request.post<DeviceItem, any>(
    `${dvmBaseUrl}maintain-mobile-device-save`,
    params
  );
  return res;
};

export const deviceDetailApi = async (dvcRgId: string) => {
  const res = await request.post<{}, any>(
    `${dvmBaseUrl}maintain-mobile-device-detail?dvcRgId=${dvcRgId}`,
    {}
  );
  return res.payload.data;
};
