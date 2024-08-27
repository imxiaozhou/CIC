import request from '@/services/axios';
import {
  AuditLogsDetailParams,
  AuditLogsDetailResponse,
  AuditLogsParams,
  AuditLogsResponse
} from './type';
import { audBaseUrl } from '../index';

export const getAuditLogs = async (params: AuditLogsParams) => {
  const res = await request.post<AuditLogsParams, AuditLogsResponse[]>(
    `${audBaseUrl}search-audit-logs`,
    params
  );
  return res.payload;
};

export const getAuditLogsDetail = async (params: AuditLogsDetailParams) => {
  const res = await request.post<
    AuditLogsDetailParams,
    AuditLogsDetailResponse
  >(`${audBaseUrl}get-audit-logs-detail`, params);
  return res.payload;
};

export const AuditPrintInCSV = async (params: AuditLogsParams) => {
  const res = await request.download<AuditLogsParams>(
    `${audBaseUrl}export-audit-log-csv`,
    params
  );
  return res;
};

export const AuditPrintInPDF = async (params: AuditLogsParams) => {
  const res = await request.download<AuditLogsParams>(
    `${audBaseUrl}export-audit-log-pdf`,
    params
  );
  return res;
};
