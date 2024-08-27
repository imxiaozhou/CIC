import request from '@/services/axios';
import {
  MaintainIpWhiteParams,
  MaintainIpWhiteResponse,
  MaintainIpWhiteDelParams,
  MaintainIpWhiteUpdateParams
} from './type';

const baseUrl = '/sma-adm/api/mgt/sys/';

export const getMaintainIpWhiteList = async (params: MaintainIpWhiteParams) => {
  const res = await request.post<
    MaintainIpWhiteParams,
    MaintainIpWhiteResponse[]
  >(`${baseUrl}get-maintain-ip-whitelist`, params);
  return res.payload;
};

export const updateMaintainIpWhiteList = async (
  params: MaintainIpWhiteUpdateParams
) => {
  const res = await request.post<MaintainIpWhiteUpdateParams>(
    `${baseUrl}update-ip-whitelist`,
    params
  );
  return res;
};

export const delMaintainIpWhiteList = async (
  params: MaintainIpWhiteDelParams
) => {
  const res = await request.post<MaintainIpWhiteDelParams>(
    `${baseUrl}delete-ip-whitelist`,
    params
  );
  return res;
};
