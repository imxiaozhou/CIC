import request from '@/services/axios';
import {
  SearchManageMessageParams,
  SearchManageMessageResponse,
  DetailManageMessageParams,
  DetailManageMessageResponse
} from './type';

const baseUrl = 'sma-adm/api/mgt/msg/';

export const searchManageMessage = async (
  params: SearchManageMessageParams
) => {
  const res = await request.post<
    SearchManageMessageParams,
    SearchManageMessageResponse[]
  >(`${baseUrl}search-manage-message`, params);
  return res.payload;
};

export const detailManageMessage = async (
  params: DetailManageMessageParams
) => {
  const res = await request.post<
    DetailManageMessageParams,
    DetailManageMessageResponse
  >(`${baseUrl}get-manage-message-detail`, params);
  return res;
};
