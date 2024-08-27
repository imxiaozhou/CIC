import request from '../../axios';
import { MessageStorageQuotaOParams, SearchParams } from './type';

const certApi = '/sma-adm/api/mgt/sys/';

export const getUserTotalMessageList = async (params: SearchParams) => {
  const res = await request.post<SearchParams, any>(
    certApi + 'get-user-total-message-list',
    params
  );
  return res.payload;
};
export const adjustMessageStorageQuota = async (
  params: MessageStorageQuotaOParams
) => {
  const res = await request.post<MessageStorageQuotaOParams, any>(
    certApi + 'adjust-message-storage-quota',
    params
  );
  return res;
};
export const getMessageStorageDef = async (params: string[]) => {
  const res = await request.post<string[], any>(
    certApi + 'get-message-storage-def',
    params
  );
  return res.payload;
};
