import request from '../axios';
import {
  ValidateOtpResponse,
  ValidateOtp,
  ValidateUserIP,
  UserId,
  UserInfo
} from './type';

const baseUrl = '/sma-adm/api/mgt/usr/';
const systemUrl = '/sma-adm/api/mgt/sys/';

export const getUserMenu = async (params: UserId) => {
  const res = await request.post<UserId, string[]>(
    `${baseUrl}get-user-menu`,
    params
  );
  return res.payload;
};

export const getUserInfo = async () => {
  const res = await request.post<object, UserInfo>(
    `${baseUrl}get-user-info`,
    {}
  );
  return res.payload.data;
};

export const validateUserIp = async () => {
  const res = await request.post<object, ValidateUserIP>(
    `${systemUrl}validate-user-ip`,
    {}
  );
  return res.payload.data;
};

export const validateOtp = async (params: ValidateOtp) => {
  const res = await request.post<ValidateOtp, ValidateOtpResponse>(
    '/sma-adm/api/otp/adm-validate-otp',
    params
  );
  return res.payload.data;
};

export const saveLogonRecord = () => {
  return request.post<object, any>(`sma-adm/api/adm-save-logon-record`, {});
};

export const logoutSystem = async () => {
  const res = await request.post<object, any>(
    '/sma-adm/public/service/adm-logout',
    {}
  );
  return res;
};

export * from './type';
