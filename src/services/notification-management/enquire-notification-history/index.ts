import request from '@/services/axios';
import { NotificationHistoryParams, NotificationHistoryResponse } from './type';

const baseUrl = '/sma-adm/api/mgt/ntm/';

export const getNotificationHistory = async (
  params: NotificationHistoryParams
) => {
  const res = await request.post<
    NotificationHistoryParams,
    NotificationHistoryResponse[]
  >(`${baseUrl}search-notification-history`, params);
  return res.payload;
};
