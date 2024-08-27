import {
  UserReportPrintProps,
  UserReportSearchProps
} from '@/pages/audit-trials-logs-report-management/list-of-users-report/type';
import { audBaseUrl } from '.';
import request from '../axios';

export const searchUserReportApi = async (params: UserReportSearchProps) => {
  const res = await request.post<UserReportSearchProps, any>(
    `${audBaseUrl}search-user-report`,
    params
  );
  return res.payload;
};

export const PrintInCSVApi = async (
  params: UserReportPrintProps | undefined
) => {
  const res = await request.download<UserReportPrintProps | undefined>(
    `${audBaseUrl}print-in-csv`,
    params
  );
  return res;
};

export const PrintInPDFApi = async (
  params: UserReportPrintProps | undefined
) => {
  const res = await request.download<UserReportPrintProps | undefined>(
    `${audBaseUrl}print-in-pdf`,
    params
  );
  return res;
};
