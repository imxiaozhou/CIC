import request from '../../axios';
import { MessageStorageQuotaOParams, SearchParams } from './type';

const certApi = '/sma-adm/api/mgt/sys/';

export const getMessageParameters = async (params: SearchParams) => {
  const res = await request.post<SearchParams, any>(
    certApi + 'get-maintain-message-parameters',
    params
  );
  return res.payload;
};
export const getMessageParamDef = async (params: string[]) => {
  const res = await request.post<string[], any>(
    certApi + 'get-message-param-def',
    params
  );
  return res.payload;
};

export const adjustMessageParameters = async (
  params: MessageStorageQuotaOParams
) => {
  const res = await request.post<MessageStorageQuotaOParams, any>(
    certApi + 'adjust-message-parameters',
    params
  );
  return res;
};
