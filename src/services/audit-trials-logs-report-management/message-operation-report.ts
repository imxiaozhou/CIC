import request from '../axios';
import { audBaseUrl } from '.';
import {
  MessageOperationReportPrintParams,
  MessageOperationReportSearchParams
} from '@/pages/audit-trials-logs-report-management/message-operation-report/type';

export const searchMessageOperationReportApi = async (
  params: MessageOperationReportSearchParams
) => {
  const res = await request.post<MessageOperationReportSearchParams, any>(
    `${audBaseUrl}search-message-operation-report`,
    params
  );
  return res.payload;
};

export const postCSVApi = async (
  params: MessageOperationReportPrintParams | undefined
) => {
  const res = await request.download<
    MessageOperationReportPrintParams | undefined
  >(`${audBaseUrl}post-csv`, params);
  return res;
};

export const postPDFApi = async (
  params: MessageOperationReportPrintParams | undefined
) => {
  const res = await request.download<
    MessageOperationReportPrintParams | undefined
  >(`${audBaseUrl}post-pdf`, params);
  return res;
};
