import request from '../../axios';
import {
  ApproCertSearchParams,
  ApproCertSearchResponse,
  ApproveCertPageDataParams,
  ApproveCertPageDataResponse,
  ApproveCertPageDataBasicParams,
  ApproCertPageDataBasicResponse,
  CertPageDataApproveReject,
  ApproveCertPageDataDetailParams,
  ApproveCertPageDataDetailResponse
} from './type';

export const searchSMAUserApproveCertList = async (
  params: ApproCertSearchParams
) => {
  const res = await request.post<
    ApproCertSearchParams,
    ApproCertSearchResponse[]
  >('/sma-adm/api/mgt/usr/user-certificate-summary-search', params);
  return res.payload;
};

export const getSMAUserApproveCertPage = async (
  params: ApproveCertPageDataParams
) => {
  const res = await request.post<
    ApproveCertPageDataParams,
    ApproveCertPageDataResponse[]
  >('/sma-adm/api/mgt/usr/approve-certificate-data', params);
  return res.payload;
};
export const getSMAUserApproveCertPageBasic = async (
  params: ApproveCertPageDataBasicParams
) => {
  const res = await request.post<
    ApproveCertPageDataBasicParams,
    ApproCertPageDataBasicResponse[]
  >('/sma-adm/api/mgt/usr/approve-certificate-basic', params);
  return res.payload;
};
export const getSMAUserApproveCertPageDetail = async (
  params: ApproveCertPageDataDetailParams
) => {
  const res = await request.post<
    ApproveCertPageDataDetailParams,
    ApproveCertPageDataDetailResponse[]
  >('/sma-adm/api/mgt/usr/approve-certificate-data-view', params);
  return res.payload;
};

export const getSMAUserApproCertApproveRej = async (
  params: CertPageDataApproveReject
) => {
  const res = await request.post<CertPageDataApproveReject, any>(
    '/sma-adm/api/mgt/usr/approve-certificate-approve-reject',
    params
  );
  return res;
};
