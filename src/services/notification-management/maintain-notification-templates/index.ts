import request from '../../axios';
import {
  AddNotificationTemplateParams,
  IsUniqueTemplateNameParams,
  SearchNotificationTemplateParams
} from './type';

const ntmBaseUrl = '/sma-adm/api/mgt/ntm/';

export const searchNotificationTemplateApi = async (
  params: SearchNotificationTemplateParams
) => {
  const res = await request.post<SearchNotificationTemplateParams, any>(
    `${ntmBaseUrl}search-notification-template`,
    params
  );
  return res.payload;
};

export const addNotificationTemplateApi = async (
  params: AddNotificationTemplateParams
) => {
  const res = await request.post<AddNotificationTemplateParams, any>(
    `${ntmBaseUrl}add-notification-template`,
    params
  );
  return res;
};

export const deleteNotificationTemplateApi = async (params: { id: string }) => {
  const res = await request.post<{ id: string }, any>(
    `${ntmBaseUrl}delete-notification-template`,
    params
  );
  return res;
};

export const updateNotificationTemplateApi = async (
  params: AddNotificationTemplateParams
) => {
  const res = await request.post<AddNotificationTemplateParams, any>(
    `${ntmBaseUrl}update-notification-template`,
    params
  );
  return res;
};

export const isUniqueTemplateNameApi = async (
  params: IsUniqueTemplateNameParams
) => {
  const res = await request.post<IsUniqueTemplateNameParams, any>(
    `${ntmBaseUrl}is-unique-tempalteName`,
    params
  );
  return res.payload;
};
