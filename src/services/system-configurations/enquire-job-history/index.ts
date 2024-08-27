import request from '@/services/axios';
import { JobHistoryParams, JobHistoryResponse } from './type';

const baseUrl = '/sma-adm/api/mgt/sys/';

export const getJobHistory = async (params: JobHistoryParams) => {
  const res = await request.post<JobHistoryParams, JobHistoryResponse[]>(
    `${baseUrl}search-job-history`,
    params
  );
  return res.payload;
};
