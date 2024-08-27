import request from '../axios';
import { GlobalParameterProps } from './type';

const baseUrl = '/sma-adm/api/mgt/oth/';

export const getFaqsApi = async (params = {}) => {
  const res = await request.post(`${baseUrl}get-faqs`, params);
  return res.payload.data;
};

export const getGlobalParameter = async (params: GlobalParameterProps) => {
  const res = await request.post(
    '/sma-adm/api/mgt/sys/get-globalParameter',
    params
  );
  return res.payload.data;
};
