import request from '@/services/axios';
import {
  NotificationsListParams,
  NotificationsListResponse,
  NotificationsIsReadParams
} from './type';
import { dvmBaseUrl } from '../index';

export const getNotificationsList = async (params: NotificationsListParams) => {
  const res = await request.post<
    NotificationsListParams,
    NotificationsListResponse[]
  >(`${dvmBaseUrl}get-notifications-list`, params);
  return res.payload;
};

export const setNotificationsIsRead = async (
  params: NotificationsIsReadParams
) => {
  const res = await request.post<NotificationsIsReadParams, any>(
    `${dvmBaseUrl}set-notifications-isRead`,
    params
  );
  return res.payload;
};
