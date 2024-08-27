import request from '../../axios';
import {
  AdjustMessageStorageQuotaGroupParams,
  SearchEmailGroupParams
} from './type';

const groupApi = '/sma-adm/api/mgt/sys/';
export const adjustMessageStorageQuotaGroupApi = async (
  params: AdjustMessageStorageQuotaGroupParams
) => {
  const res = await request.post<AdjustMessageStorageQuotaGroupParams, any>(
    `${groupApi}adjust-message-storage-quota-group`,
    params
  );
  return res;
};

export const searchEmailGroupApi = async (params: SearchEmailGroupParams) => {
  const res = await request.post<SearchEmailGroupParams, any>(
    `${groupApi}search-email-group`,
    params
  );
  return res.payload;
};

export const messageStorageQuotaGroupDetailApi = async (params: any) => {
  const res = await request.post(
    `${groupApi}email-message-storage-quota-detail`,
    params
  );
  return res.payload;
};
