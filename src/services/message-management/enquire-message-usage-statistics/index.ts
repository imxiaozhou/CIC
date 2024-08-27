import request from '@/services/axios';
import {
  SearchMessageUsageParams,
  SearchMessageUsageResponse,
  DetailManageMessageParams,
  DetailManageMessageResponse
} from './type';

const baseUrl = 'sma-adm/api/mgt/msg/';

export const searchMessageUsage = async (params: SearchMessageUsageParams) => {
  const res = await request.post<
    SearchMessageUsageParams,
    SearchMessageUsageResponse[]
  >(`${baseUrl}search-message-usage-statistics`, params);
  return res.payload;
};

export const detailManageMessage = async (
  params: DetailManageMessageParams
) => {
  const res = await request.post<
    DetailManageMessageParams,
    DetailManageMessageResponse
  >(`${baseUrl}get-message-usage-statistics-detail`, params);
  return res.payload;
};
