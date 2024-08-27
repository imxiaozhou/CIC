import { SearchUserForAdHocParams } from '@/pages/notification-management/send-ad-hoc-notification/type';
import request from '../../axios';
import { SendAdHocNotificationProps } from './type';

const baseUrl = '/sma-adm/api/mgt/ntm/';

export const searchSendAdHocNotificationApi = async (
  params: SearchUserForAdHocParams
) => {
  const res = await request.post<SearchUserForAdHocParams, any>(
    `${baseUrl}search-send-ad-hoc-notiofication`,
    params
  );
  return res.payload;
};

export const sendAdHocNotificationApi = async (
  params: SendAdHocNotificationProps
) => {
  const res = await request.post<SendAdHocNotificationProps, any>(
    `${baseUrl}send-ad-hoc-notification`,
    params
  );
  return res;
};

export const getTemplateListApi = async () => {
  const res = await request.post<{}, any>(`${baseUrl}get-template-list`, {});
  return res.payload;
};
