import {
  SummaryReportExportProps,
  SummaryReportSearchProps
} from '@/pages/audit-trials-logs-report-management/summary-of-message-traffic/type';
import { audBaseUrl } from '.';
import request from '../axios';

export const searchSumTrafficApi = async (params: SummaryReportSearchProps) => {
  const res = await request.post<SummaryReportSearchProps, any>(
    `${audBaseUrl}search-summary-of-message-traffic`,
    params
  );
  return res.payload;
};

export const exportInCSVApi = async (
  params: SummaryReportExportProps | undefined
) => {
  const res = await request.download<SummaryReportExportProps | undefined>(
    `${audBaseUrl}export-in-csv`,
    params
  );
  return res;
};

export const exportInPDFApi = async (
  params: SummaryReportExportProps | undefined
) => {
  const res = await request.download<SummaryReportExportProps | undefined>(
    `${audBaseUrl}export-in-pdf`,
    params
  );
  return res;
};
