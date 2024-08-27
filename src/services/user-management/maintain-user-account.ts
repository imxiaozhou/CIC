import request from '../axios';
import {
  SearchParams,
  DeleteParams,
  SearchAddressBook,
  SearchResponse,
  SubmitUser,
  IdOrids,
  ResetPasswordParams,
  ChangePasswordParams
} from './type';

const baseUrl = '/sma-adm/api/mgt/usr/';

export const searchSMAUser = async (params: SearchParams) => {
  const res = await request.post<SearchParams, SearchResponse[]>(
    `${baseUrl}search-sma-user`,
    params
  );
  return res.payload;
};

export const deleteSMAUser = async (params: DeleteParams) => {
  const res = await request.post<DeleteParams, any>(
    `${baseUrl}delete-sma-user`,
    params
  );
  return res;
};

export const searchAddressBook = async (params: SearchAddressBook) => {
  const res = await request.post<SearchAddressBook, SearchResponse[]>(
    `${baseUrl}search-address-book`,
    params
  );
  return res.payload;
};

export const addAddressBook = async (emailAddress: string) => {
  const res = await request.post<IdOrids, number>(`${baseUrl}is-add-new-user`, {
    emailAddress
  });
  return res.payload.data;
};

export const submitSMAUser = async (params: SubmitUser) => {
  const res = await request.post<SubmitUser, any>(
    `${baseUrl}submit-user-data`,
    params
  );
  return res;
};

export const userChangePassword = async (params: ChangePasswordParams) => {
  const res = await request.post<ChangePasswordParams, any>(
    `${baseUrl}change-password`,
    params
  );
  return res;
};

export const userResetPassword = async (params: ResetPasswordParams) => {
  const res = await request.post<ResetPasswordParams, any>(
    `${baseUrl}adm-reset-user-password`,
    params
  );
  return res;
};

export const getPasswordPolicyRegex = async () => {
  const res = await request.get(
    '/sma-adm/api/mgt/sys/get-password-policy-regex',
    {
      data: {}
    }
  );
  return res.payload;
};

export * from './type';
