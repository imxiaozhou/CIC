import request from '@/services/axios';
import { UserLogonParams, SerLogonResponse } from './type';

const baseUrl = '/sma-adm/api/mgt/rpt/';

export const getConcurrentUserLogon = async (params: UserLogonParams) => {
  const res = await request.post<UserLogonParams, SerLogonResponse[]>(
    `${baseUrl}search-concurrent-user-logon`,
    params
  );
  return res.payload;
};
