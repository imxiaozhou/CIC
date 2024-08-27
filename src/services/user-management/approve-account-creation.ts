import request from '../axios';
import { SearchParams, SearchResponse } from './type';
import {
  ApproveProps,
  ApproveAccountDetailParams
} from '@/pages/user-management/approve-account-creation/type';

export const searchSMAUserApproveAccList = async (params: SearchParams) => {
  const res = await request.post<SearchParams, SearchResponse[]>(
    '/sma-adm/api/mgt/usr/get-approve-accountlist',
    params
  );
  return res.payload;
};

export const getSMAUserApproveAccDetail = async (
  params: ApproveAccountDetailParams
) => {
  const res = await request.post<ApproveAccountDetailParams, SearchResponse[]>(
    '/sma-adm/api/mgt/usr/get-approve-account-detail',
    params
  );
  return res;
};

export const getSMAUserAccApproveRej = async (params: ApproveProps) => {
  const res = await request.post<ApproveProps, SearchResponse[]>(
    '/sma-adm/api/mgt/usr/get-account-approve-reject',
    params
  );
  return res;
};
