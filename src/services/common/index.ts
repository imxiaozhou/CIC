import request from '../axios';
import { store } from '@/store';
import { OptionsParam } from './type';

const optionsBase = '/sma-adm/api/mgt/mstcode/';

export const getCommonOptions = async (params: OptionsParam) => {
  const res = await request.post<OptionsParam, LabelValue[]>(
    `${optionsBase}get-common-options`,
    params
  );
  return res.payload.data;
};

export const getUserRoleOptions = async () => {
  const userInfo = selectUserInfo(store.getState());
  const res = await request.post('/sma-adm/api/common/get-roles-options', {
    superAdmin: Number(userInfo.userRole!.includes('SUPER_ADM'))
  });
  return res.payload.data;
};

export const getSelectSearchableApi = async (url: string, params: {}) => {
  const res = await request.post(url, params);
  return res.payload;
};

export const getEmailGroupsOptions = async () => {
  const res = await request.post<object, LabelValue[]>(
    '/sma-adm/api/common/get-email-groups-options',
    {}
  );
  return res.payload.data;
};

export const getTenantOptionsApi = async (params: { keyword: string }) => {
  const res = await request.post(
    'sma-adm/api/common/search-tenant-name',
    params
  );
  return res.payload.data;
};

export const getEventTypeOptionsApi = async (params: { keyword: string }) => {
  const res = await request.post(
    'sma-adm/api/common/search-event-type',
    params
  );
  return res.payload.data;
};

export const downImg = async (params: { fileName: string }) => {
  const res = await request.post<any, any>(
    'sma-adm/api/common/view-logo',
    params
  );
  return res.payload.data;
};
