import request from '../../axios';
import {
  SearchParams,
  SearchResponse,
  BasicParams,
  BasicCertList,
  CertDetail,
  UpdateApprStatus,
  CertCreate
} from './type';

const certApi = '/sma-adm/api/user/cert';
export const searchUserCertificate = async (params: SearchParams) => {
  const res = await request.post<SearchParams, SearchResponse[]>(
    certApi + '/search',
    params
  );
  return res.payload;
};
export const userStatus = async () => {
  const res = await request.get(certApi + '/userStatus');
  return res.payload.data;
};
export const userRole = async () => {
  const res = await request.get(certApi + '/userRole');
  return res.payload.data;
};
export const accountStauts = async () => {
  const res = await request.get(certApi + '/accountStauts');
  return res.payload.data;
};
export const certType = async () => {
  const res = await request.get(certApi + '/certType');
  return res.payload.data;
};
export const certStatus = async () => {
  const res = await request.get(certApi + '/certStatus');
  return res.payload.data;
};
export const certApprStatus = async () => {
  const res = await request.get(certApi + '/certApprStatus');
  return res.payload.data;
};
export const certExpiration = async () => {
  const res = await request.get(certApi + '/certExpiration');
  return res.payload.data;
};

export const getBasicInfo = async (params: BasicParams) => {
  const res = await request.post(certApi + '/basic', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.payload;
};
export const getBasicCertList = async (params: BasicCertList) => {
  const res = await request.post(certApi + '/basic/certList', params);
  return res.payload;
};
export const getCertDetail = async (params: CertDetail) => {
  const res = await request.post(certApi + '/certDetail', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.payload;
};
export const updateApprStatus = async (params: UpdateApprStatus) => {
  const res = await request.post(certApi + '/updateApprStatus', params);
  return res;
};
export const sava = async (params: CertCreate) => {
  const res = await request.post(certApi + '/save', params);
  return res;
};

export const downloadCertificate = async (key: string) => {
  const res = await request.download(`${certApi}/export?userCertId=${key}`, {});
  return res;
};
export const importCertificate = async (params: any) => {
  const res = await request.post(certApi + '/import', params, {});
  return res;
};
