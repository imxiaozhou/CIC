import request from '@/services/axios';
import {
  MaintainUiDefaultSettingParams,
  MaintainUiDefaultSettingResponse,
  MaintainUiDefaultDetailParams,
  MaintainUiDefaultSettingDetailResponse,
  submitMaintainUiDefaultDetailParams
} from './type';

const baseUrl = '/sma-adm/api/mgt/sys/';

export const searchMaintainUiDefaultSetting = async (
  params: MaintainUiDefaultSettingParams
) => {
  const res = await request.post<
    MaintainUiDefaultSettingParams,
    MaintainUiDefaultSettingResponse[]
  >(`${baseUrl}search-maintain-ui-default-setting`, params);
  return res.payload;
};

export const getMaintainUiDefaultSettingDetail = async (
  params: MaintainUiDefaultDetailParams
) => {
  const res = await request.post<
    MaintainUiDefaultDetailParams,
    MaintainUiDefaultSettingDetailResponse
  >(`${baseUrl}get-maintain-ui-default-setting-detail`, params);
  return res.payload;
};

export const submitMaintainUiDefaultSetting = async (
  params: submitMaintainUiDefaultDetailParams
) => {
  const res = await request.post<submitMaintainUiDefaultDetailParams, any>(
    `${baseUrl}update-maintain-ui-default-setting`,
    params
  );
  return res;
};
