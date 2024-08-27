import request from '@/services/axios';
import {
  SearchUserDelegationParams,
  SearchUserDelegationResponse,
  UserDelegationDetailParams,
  UserDelegationDetailResponse,
  SearchLookupUserParams,
  SearchLookupUserResponse,
  SubmitUserDelegationParams,
  SubmitUserDelegationResponse
} from './type';

export const searchUserDelegation = async (
  params: SearchUserDelegationParams
) => {
  const res = await request.post<
    SearchUserDelegationParams,
    SearchUserDelegationResponse[]
  >('/sma-adm/api/mgt/usr/search-user-delegation', params);
  return res.payload;
};

export const userDelegationDetail = async (
  params: UserDelegationDetailParams
) => {
  const res = await request.post<
    UserDelegationDetailParams,
    UserDelegationDetailResponse
  >('/sma-adm/api/mgt/usr/user-delegation-detail', params);
  return res.payload;
};

export const submitUserDelegationData = async (
  params: SubmitUserDelegationParams
) => {
  const res = await request.post<
    SubmitUserDelegationParams,
    SubmitUserDelegationResponse[]
  >('/sma-adm/api/mgt/usr/submit-user-delegation-data', params);
  return res;
};

export const searchLookupUser = async (params: SearchLookupUserParams) => {
  const res = await request.post<
    SearchLookupUserParams,
    SearchLookupUserResponse[]
  >('/sma-adm/api/mgt/usr/search-lookup-user', params);
  return res.payload;
};
